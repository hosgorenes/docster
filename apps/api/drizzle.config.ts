import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

export default defineConfig({
    schema: "./src/schema.ts",
    out: "./migrations",
    dialect: "sqlite",
    dbCredentials: {
        url: "./sqlite.db",
    },
});

