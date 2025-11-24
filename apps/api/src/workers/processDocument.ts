import type { Job } from "bullmq";
import axios from "axios";
import {
    Proposal as ProposalProfile,
    HVAC as HVACProfile,
    Statement as StatementProfile,
    Receipt as ReceiptProfile,
} from "docster-profiles";
import logger from "../lib/logger";
import { getObjectAsBuffer } from "../utils/minio";
import { processDocumentsWithAI, fallbackProcessing } from "../../../web/app/lib/googleai.server";
import { db } from "../utils/db";
import { eq } from "drizzle-orm";
import { jobsTable } from "../schema";

const profileFactory: Record<string, () => any> = {
    proposal: () => new ProposalProfile(),
    hvac: () => new HVACProfile(),
    statement: () => new StatementProfile(),
    receipt: () => new ReceiptProfile(),
};

const resolveProfile = (profileName?: string) => {
    const factory =
        profileFactory[profileName?.toLowerCase() ?? ""] ?? profileFactory.statement;
    return factory();
};

// Main function to process the document
export async function processDocument(job: Job) {
    const { jobId, fileUrl, profileName, fileName, objectName, fileType } = job.data;

    logger.info(`[${jobId}] Processing started.`);

    try {
        // Get file as Buffer from MinIO or fallback to axios
        let fileBuffer: Buffer;

        if (objectName) {
            fileBuffer = await getObjectAsBuffer(objectName);
        } else {
            // fallback to URL download
            const res = await axios.get(fileUrl, { responseType: "arraybuffer" });
            fileBuffer = Buffer.from(res.data);
        }

        const profile = resolveProfile(profileName);

        // Send file to AI
        const files = [
            {
                fileBuffer,
                fileName: fileName || "document",
                fileType: fileType ?? "application/pdf",
            },
        ];

        const result = await processDocumentsWithAI(files, profile);
        const outputJson = Array.isArray(result?.json) ? result.json : [];

        // Save AI result to DB
        await db
            .update(jobsTable)
            .set({
                status: "completed",
                output: JSON.stringify(outputJson),
                finishedAt: Math.floor(Date.now() / 1000),
            })
            .where(eq(jobsTable.jobId, jobId));

        logger.info(`[${jobId}]  Process completed successfully.`);
    } catch (err) {
        logger.error(`[${jobId}]  Processing failed. Running fallback...`, { error: err as Error });

        try {
            // Fallback mode (if AI or MinIO failed)
            const profile = resolveProfile(profileName);

            const fallbackFiles = [{ fileName: fileName || "unknown.pdf" }] as any;
            const fallbackResult = await fallbackProcessing(fallbackFiles, profile);
            const fallbackJson = Array.isArray(fallbackResult?.json)
                ? fallbackResult.json
                : [];

            await db
                .update(jobsTable)
                .set({
                    status: "completed", // still mark completed so UI shows something
                    output: JSON.stringify(fallbackJson),
                    finishedAt: Math.floor(Date.now() / 1000),
                })
                .where(eq(jobsTable.jobId, jobId));

            logger.warn(`[${jobId}] ⚠️ Fallback completed.`);
        } catch (_fallbackErr) {
            // Even fallback failed → mark as failed
            await db
                .update(jobsTable)
                .set({
                    status: "failed",
                    finishedAt: Math.floor(Date.now() / 1000),
                })
                .where(eq(jobsTable.jobId, jobId));

            logger.error(`[${jobId}] ❌ Both main and fallback failed.`);
        }
    }
}
