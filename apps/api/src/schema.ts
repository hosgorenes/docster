import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const jobsTable = sqliteTable("jobs", {
    jobId: text("job_id").primaryKey(),
    batchId: text("batch_id").notNull(),
    fileName: text("file_name").notNull(),
    userEmail: text("user_email").notNull(),
    fileUrl: text("file_url"),
    status: text("status").notNull(),
    output: text("output").default(""),
    createdAt: integer("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    finishedAt: integer("finished_at"),
});
