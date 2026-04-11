import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import Database from "better-sqlite3";
import { env } from "../config/env.js";
import { INIT_SQL } from "./schema.js";
import { runMigrations } from "./migrate.js";
let resolvedPath = path.isAbsolute(env.DATABASE_PATH)
    ? env.DATABASE_PATH
    : path.resolve(process.cwd(), env.DATABASE_PATH);
try {
    fs.mkdirSync(path.dirname(resolvedPath), { recursive: true });
}
catch (err) {
    if (err instanceof Error &&
        err.code !== undefined &&
        ["EACCES", "ENOENT", "EPERM"].includes(err.code)) {
        const fallbackPath = path.join(os.tmpdir(), path.basename(resolvedPath));
        fs.mkdirSync(path.dirname(fallbackPath), { recursive: true });
        resolvedPath = fallbackPath;
        console.warn(`Using fallback SQLite path because ${env.DATABASE_PATH} is not writable: ${resolvedPath}`);
    }
    else {
        throw err;
    }
}
export const db = new Database(resolvedPath);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");
db.exec(INIT_SQL);
runMigrations(db);
//# sourceMappingURL=index.js.map