import type { Job } from "bullmq";
import axios from "axios";
import { getObjectAsBuffer } from "../utils/minio";
import { processDocumentsWithAI, fallbackProcessing } from "../../../web/app/lib/googleai.server";
import { db } from "../utils/db";
import { eq } from "drizzle-orm";
import { jobsTable } from "../schema";
import {
    Proposal as ProposalProfile,
    HVAC as HVACProfile,
    Statement as StatementProfile,
} from "docster-profiles";

// Main function to process the document
export async function processDocument(job: Job) {
    const { fileUrl, profileName, fileName, objectName } = job.data;

    console.log(`[${job.id}] Processing started.`);

    try {
        // 1. Get file as Buffer from MinIO or fallback to axios
        let fileBuffer: Buffer;

        if (objectName) {
            fileBuffer = await getObjectAsBuffer(objectName);
        } else {
            // fallback to URL download
            const res = await axios.get(fileUrl, { responseType: "arraybuffer" });
            fileBuffer = Buffer.from(res.data);
        }

        // 2. Map profileName → Profile instance
        let profile: any;
        switch (profileName?.toLowerCase()) {
            case "proposal":
                profile = new ProposalProfile();
                break;
            case "hvac":
                profile = new HVACProfile();
                break;
            case "statement":
            default:
                profile = new StatementProfile();
                break;
        }

        // 3. Send file to AI
        const files = [
            {
                fileBuffer,
                fileName: fileName || "document.pdf",
                fileType: "application/pdf",
            },
        ];

        const result = await processDocumentsWithAI(files, profile);

        // 4. Save AI result to DB
        await db
            .update(jobsTable)
            .set({
                status: "completed",
                output: JSON.stringify(result),
                finishedAt: Math.floor(Date.now() / 1000),
            })
            .where(eq(jobsTable.jobId, job.id as unknown as string));

        console.log(`[${job.id}] ✅ Process completed successfully.`);
    } catch (err) {
        console.error(`[${job.id}] ❌ Processing failed. Running fallback...`);

        try {
            // 5. Fallback mode (if AI or MinIO failed)
            let profile: any;
            switch (profileName?.toLowerCase()) {
                case "proposal":
                    profile = new ProposalProfile();
                    break;
                case "hvac":
                    profile = new HVACProfile();
                    break;
                case "statement":
                default:
                    profile = new StatementProfile();
                    break;
            }

            const fallbackFiles = [{ fileName: fileName || "unknown.pdf" }] as any;
            const fallbackResult = await fallbackProcessing(fallbackFiles, profile);

            await db
                .update(jobsTable)
                .set({
                    status: "completed", // still mark completed so UI shows something
                    output: JSON.stringify(fallbackResult),
                    finishedAt: Math.floor(Date.now() / 1000),
                })
                .where(eq(jobsTable.jobId, job.id as unknown as string));

            console.log(`[${job.id}] ⚠️ Fallback completed.`);
        } catch (_fallbackErr) {
            // 6. Even fallback failed → mark as failed
            await db
                .update(jobsTable)
                .set({
                    status: "failed",
                    finishedAt: Math.floor(Date.now() / 1000),
                })
                .where(eq(jobsTable.jobId, job.id as unknown as string));

            console.error(`[${job.id}] ❌ Both main and fallback failed.`);
        }
    }
}
