import { drizzle } from "drizzle-orm/bun-sqlite";
import Database from "bun:sqlite";
import * as schema from "../schema";

// Use the same DB file path as drizzle migrations: apps/api/sqlite.db
const sqlite = new Database("apps/api/sqlite.db");
export const db = drizzle(sqlite, { schema });
