import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { eq } from "drizzle-orm";
import { json2csv } from "json-2-csv";
import { db } from "../utils/db";
import { jobsTable } from "../schema";
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

                const combinedJson: unknown[] = [];
                for (const row of rows) {
                    if (!row.output) continue;
                    try {
                        const parsedOutput = JSON.parse(row.output);
                        if (Array.isArray(parsedOutput)) {
                            combinedJson.push(...parsedOutput);
                        }
                    } catch (parseErr) {
                        console.error(
                            `Error parsing job output for job ${row.jobId}:`,
                            parseErr
                        );
                    }
                }

                let csvData = "";
                try {
                    csvData =
                        combinedJson.length > 0
                            ? await json2csv(combinedJson as object[])
                            : "";
                } catch (csvErr) {
                    console.error(
                        "Error converting combined results to CSV:",
                        csvErr
                    );
                    csvData =
                        "Error converting to CSV: " +
                        (csvErr as Error).message;
                }

                return reply.code(200).send({
                    success: true,
                    batchId,
                    jobCount: rows.length,
                    json: combinedJson,
                    csv: csvData,
                    jobs: rows.map(
                        ({ output, ...rest }) => ({
                            ...rest,
                        })
                    ),
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
