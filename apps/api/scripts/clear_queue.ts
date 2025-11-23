import { Queue } from "bullmq";
import IORedis from "ioredis";
import logger from "../src/lib/logger";

async function main() {
    const connection = new IORedis({
        host: process.env.REDIS_HOST || "127.0.0.1",
        port: parseInt(process.env.REDIS_PORT || "6379"),
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
    });

    const q = new Queue("documentQueue", { connection });

    // Remove all jobs and related data keys
    await q.obliterate({ force: true });
    logger.info("✅ BullMQ 'documentQueue' obliterated (all jobs cleared)");

    await connection.quit();
}

main().catch((e) => {
    logger.error(e);
    process.exit(1);
});


