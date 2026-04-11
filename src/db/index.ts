import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import type { Database as SqliteDatabase } from "better-sqlite3";
import { env } from "../config/env.js";
import { INIT_SQL } from "./schema.js";
import { runMigrations } from "./migrate.js";

const resolvedPath = path.isAbsolute(env.DATABASE_PATH)
  ? env.DATABASE_PATH
  : path.resolve(process.cwd(), env.DATABASE_PATH);

fs.mkdirSync(path.dirname(resolvedPath), { recursive: true });

export const db: SqliteDatabase = new Database(resolvedPath);

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(INIT_SQL);
runMigrations(db);
