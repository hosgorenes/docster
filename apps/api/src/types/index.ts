import { z } from "zod";

// Schemas
export const ProfileSchema = z.enum(["proposal", "hvac", "statement"]);

export const EmailSchema = z
    .string()
    .trim()
    .email()
    .max(320)
    .optional()
    .default("");

// Batch IDs are short, URL-safe tokens (8 chars, lowercase alphanumeric)
export const BatchIdSchema = z
    .string()
    .length(8);

export const UploadFieldsSchema = z.object({
    profile: ProfileSchema.default("statement"),
    email: EmailSchema,
})
    .strict();

// Types
export type Profile = z.infer<typeof ProfileSchema>;
export type UploadFields = z.infer<typeof UploadFieldsSchema>;
export type BatchId = z.infer<typeof BatchIdSchema>;


