import { randomUUID } from "node:crypto";
import { db } from "../../db/index.js";
function rowToRecord(row) {
    return {
        id: row.id,
        email: row.email,
        fullName: row.full_name,
        role: row.role,
        passwordHash: row.password_hash,
        createdAt: row.created_at,
    };
}
export function findUserByEmail(email) {
    const row = db
        .prepare(`SELECT id, email, full_name, role, password_hash, created_at FROM users WHERE email = ? COLLATE NOCASE`)
        .get(email.trim().toLowerCase());
    return row ? rowToRecord(row) : null;
}
export function findUserById(id) {
    const row = db
        .prepare(`SELECT id, email, full_name, role, password_hash, created_at FROM users WHERE id = ?`)
        .get(id);
    return row ? rowToRecord(row) : null;
}
export function createUser(input) {
    const id = randomUUID();
    const email = input.email.trim().toLowerCase();
    db.prepare(`INSERT INTO users (id, email, full_name, role, password_hash) VALUES (?, ?, ?, ?, ?)`).run(id, email, input.fullName.trim(), input.role, input.passwordHash);
    const created = findUserById(id);
    if (!created)
        throw new Error("Failed to read user after insert");
    const { passwordHash: _, ...pub } = created;
    return pub;
}
export function toPublicUser(record) {
    const { passwordHash: _, ...pub } = record;
    return pub;
}
//# sourceMappingURL=user.repository.js.map