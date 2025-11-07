import { Client } from 'minio'
import { Readable } from 'stream';

export const bucketName = process.env.MINIO_BUCKET_NAME || 'sourcefiles';

export const minioClient = new Client({
    endPoint: process.env.MINIO_ENDPOINT || "localhost",
    port: Number(process.env.MINIO_PORT) || 9000,
    useSSL: false,
    accessKey: process.env.MINIO_ACCESS_KEY || "minioadmin",
    secretKey: process.env.MINIO_SECRET_KEY || "minioadmin",
});

(async () => {
    try {
        const exists = await minioClient.bucketExists(bucketName);
        if (!exists) {
            await minioClient.makeBucket(bucketName, "us-east-1");
            console.log(`🪣 Created new bucket: ${bucketName}`);
        }
    } catch (err) {
        console.error("⚠️ MinIO bucket check failed:", err);
    }
})();

export async function uploadToMinio(
    fileBuffer: Buffer,
    objectName: string
): Promise<string> {
    try {
        const stream = Readable.from(fileBuffer);
        await minioClient.putObject(bucketName, objectName, stream);
        const fileUrl = `http://${process.env.MINIO_ENDPOINT || "localhost"}:${process.env.MINIO_PORT || 9000
            }/${bucketName}/${objectName}`;
        console.log(`✅ Uploaded to MinIO: ${objectName}`);
        return fileUrl;
    } catch (err) {
        console.error("❌ Error uploading to MinIO:", err);
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