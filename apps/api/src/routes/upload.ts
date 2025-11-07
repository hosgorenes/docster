import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { createId } from "@paralleldrive/cuid2";
import multipart from "@fastify/multipart";
import { addDocumentJob } from "../utils/addDocumentJob";
import { UploadFieldsSchema } from "../types";
import {
    Proposal as ProposalProfile,
    HVAC as HVACProfile,
    Statement as StatementProfile,
} from "docster-profiles";

export async function registerUploadRoute(app: FastifyInstance) {
    // Multipart parser plugin (enables file uploading)
    app.register(multipart, {
        limits: {
            fileSize: 10 * 1024 * 1024, // 10 MB
            files: 100,
        },
    });

    // Upload endpoint
    app.post("/upload", async (req: FastifyRequest, reply: FastifyReply) => {
        // Create a unique batchId for each upload request
        const batchId = createId().slice(0, 8);

        const parts = req.parts(); // read form-data parts
        const files: { buffer: Buffer; filename: string; mimetype?: string }[] = [];
        const fields: Record<string, unknown> = {};

        // Read form parts sequentially
        for await (const part of parts) {
            if (part.type === "file") {
                // Fastify's built-in toBuffer() function: reads the file into RAM
                const buffer = await part.toBuffer();

                files.push({
                    buffer,
                    filename: part.filename ?? "file.pdf",
                    mimetype: (part as any).mimetype,
                });
            } else if (part.type === "field") {
                // save normal text fields (e.g. profile, email)
                fields[part.fieldname] = part.value;
            }
        }

        // If no files are uploaded, return an error
        if (files.length === 0) {
            return reply.code(400).send({ success: false, error: "No files uploaded" });
        }

        // Validate profile and email fields with Zod
        const parsed = UploadFieldsSchema.safeParse({
            profile:
                typeof fields.profile === "string"
                    ? fields.profile.toLowerCase()
                    : fields.profile,
            email: typeof fields.email === "string" ? fields.email : undefined,
        });

        if (!parsed.success) {
            return reply.code(400).send({ success: false, error: parsed.error.flatten() });
        }

        const { profile: profileName, email: userEmail } = parsed.data;

        // Accept only PDF files (can be extended as needed)
        for (const f of files) {
            if (f.mimetype && f.mimetype !== "application/pdf") {
                return reply.code(400).send({
                    success: false,
                    error: `Invalid file type: ${f.mimetype}`,
                });
            }
        }

        // Select AI profile (docster-profiles)
        let profile: any;
        switch (profileName.toLowerCase()) {
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

        // Add each file to the queue
        for (const f of files) {
            await addDocumentJob(
                f.buffer,
                f.filename,
                userEmail,
                profileName,
                batchId
            );
        }

        // Return results to frontend
        return reply.send({
            success: true,
            message: `${files.length} file(s) queued for processing.`,
            profileUsed: profile?.profileName || profileName,
            batchId,
        });
    });
}
