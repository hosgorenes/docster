import { Worker, Job } from "bullmq";
import IORedis from "ioredis";
import { processDocument } from "../src/workers/processDocument";

// Create a new worker that listens to the documentQueue
const worker = new Worker(
    "documentQueue",
    async (job: Job) => {
        await processDocument(job);
    },
    {
        connection: new IORedis({
            host: process.env.REDIS_HOST || "127.0.0.1",
            port: parseInt(process.env.REDIS_PORT || "6379"),
            // Required for BullMQ blocking pop
            maxRetriesPerRequest: null,
            enableReadyCheck: false,
        })
    }
);

// Minimal logging only
worker.on("error", () => console.error(`[worker] error`));
worker.on("failed", (job: Job | undefined) => {
    if (job) console.error(`[${job.id}] Processing failed.`);
    else console.error(`[worker] job failed.`);
});
