import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { db } from "../utils/db";
import { jobsTable } from "../schema";
import { eq } from "drizzle-orm";
import { BatchIdSchema } from "../types";

type ResultsParams = {
    Params: {
        batchId: string;
    };
};

export async function registerResultsRoute(app: FastifyInstance) {
    app.get<ResultsParams>(
        "/results/:batchId",
        async (req: FastifyRequest<ResultsParams>, reply: FastifyReply) => {
            const { batchId } = req.params;
            if (!batchId) {
                return reply.code(400).send({
                    success: false,
                    error: "batchId is required",
                });
            }

            const parsed = BatchIdSchema.safeParse(batchId);
            if (!parsed.success) {
                return reply.code(400).send({ success: false, error: parsed.error.flatten() });
            }

            try {
                const rows = await db
                    .select()
                    .from(jobsTable)
                    .where(eq(jobsTable.batchId, parsed.data));

                if (rows.length === 0) {
                    return reply.code(404).send({
                        success: false,
                        message: `No jobs found for batchId: ${batchId}`,
                    });
                }

                return reply.code(200).send({
                    success: true,
                    batchId,
                    count: rows.length,
                    jobs: rows,
                });
            } catch (err) {
                console.error("❌ Error fetching batch results:", err);
                return reply.code(500).send({
                    success: false,
                    error: "Internal server error while fetching batch results.",
                });
            }
        }
    );
}
