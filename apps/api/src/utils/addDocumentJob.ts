import { createId } from "@paralleldrive/cuid2";
import { docQueue } from "./queue";
import { db } from "./db";
import { jobsTable } from "../schema";
import type { Profile, BatchId } from "../types";
import { uploadToMinio } from "./minio";

// Upload file to MinIO and queue job for processing
export async function addDocumentJob(
    fileBuffer: Buffer,
    fileName: string,
    userEmail: string,
    profileName: Profile = "statement",
    batchId: BatchId
) {
    const jobId = createId();

    // Upload file to MinIO
    const objectName = `${batchId}/${jobId}-${fileName}`;
    const fileUrl = await uploadToMinio(fileBuffer, objectName);

    // Add job record to the database
    await db.insert(jobsTable).values({
        jobId,
        batchId,
        fileName,
        userEmail,
        fileUrl,
        status: "waiting",
        createdAt: Math.floor(Date.now() / 1000),
    });

    // Send URL information to the queue
    console.log("📤 Queuing document for AI processing:", { jobId, fileName });
    await docQueue.add(
        "processDocument", // same name as defined in worker.ts
        { jobId, fileUrl, userEmail, profileName, batchId, fileName, objectName },
        { jobId }
    );

    console.log(`✅ Job queued successfully: ${jobId}`);
    return jobId;
}
