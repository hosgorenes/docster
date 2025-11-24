import { Client } from 'minio'
import { Readable } from 'stream';
import logger from '../lib/logger';

export const bucketName = process.env.MINIO_BUCKET_NAME || 'sourcefiles';

const minioEndpoint = process.env.MINIO_ENDPOINT || "localhost";
const minioPort = Number(process.env.MINIO_PORT) || 9000;
const minioUseSSL = process.env.MINIO_USE_SSL === "true";

export const minioClient = new Client({
    endPoint: minioEndpoint,
    port: minioPort,
    useSSL: minioUseSSL,
    accessKey: process.env.MINIO_ACCESS_KEY || "minioadmin",
    secretKey: process.env.MINIO_SECRET_KEY || "minioadmin",
});

(async () => {
    try {
        const exists = await minioClient.bucketExists(bucketName);
        if (!exists) {
            await minioClient.makeBucket(bucketName, "us-east-1");
            logger.info(`🪣 Created new bucket: ${bucketName}`);
        }
    } catch (err) {
        logger.error("⚠️ MinIO bucket check failed:", err);
    }
})();

export async function uploadToMinio(
    fileBuffer: Buffer,
    objectName: string
): Promise<string> {
    try {
        const stream = Readable.from(fileBuffer);
        await minioClient.putObject(bucketName, objectName, stream);
        const baseUrl =
            process.env.MINIO_PUBLIC_URL ||
            `${minioUseSSL ? "https" : "http"}://${minioEndpoint}:${minioPort}`;
        const fileUrl = `${baseUrl}/${bucketName}/${objectName}`;
        logger.info(`✅ Uploaded to MinIO: ${objectName}`);
        return fileUrl;
    } catch (err) {
        logger.error("❌ Error uploading to MinIO:", err);
        throw err;
    }
}

// Helper function to convert MinIO stream to buffer (similar to Fastify's toBuffer)
export async function getObjectAsBuffer(objectName: string): Promise<Buffer> {
    const stream = await minioClient.getObject(bucketName, objectName);
    const chunks: Buffer[] = [];
    for await (const chunk of stream as any) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    return Buffer.concat(chunks);
}