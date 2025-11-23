import { Worker, Job } from "bullmq";
import IORedis from "ioredis";
import logger from "./lib/logger";
import { processDocument } from "./workers/processDocument";

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
            maxRetriesPerRequest: null,
            enableReadyCheck: false,
        })
    }
);

// Minimal logging only
worker.on("error", (err) => logger.error(`[worker] error`, err));
worker.on("failed", (job: Job | undefined) => {
    if (job) logger.error(`[${job.id}] Processing failed.`);
    else logger.error(`[worker] job failed.`);
});
