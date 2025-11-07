import { Queue } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis({
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: parseInt(process.env.REDIS_PORT || "6379"),
    // BullMQ requires this to be null when using blocking commands
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
});

export const docQueue = new Queue("documentQueue", { connection });
