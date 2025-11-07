import { Queue } from "bullmq";
import IORedis from "ioredis";

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
    console.log("✅ BullMQ 'documentQueue' obliterated (all jobs cleared)");

    await connection.quit();
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});


