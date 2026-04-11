import type { Database as SqliteDatabase } from "better-sqlite3";

function tableColumns(db: SqliteDatabase, table: string): Set<string> {
  const rows = db.prepare(`PRAGMA table_info(${table})`).all() as {
    name: string;
  }[];
  return new Set(rows.map((r) => r.name));
}

/**
 * Idempotent schema upgrades for existing SQLite files.
 */
export function runMigrations(db: SqliteDatabase): void {
  const ot = tableColumns(db, "online_tests");
  if (!ot.has("question_type")) {
    db.exec(
      `ALTER TABLE online_tests ADD COLUMN question_type TEXT NOT NULL DEFAULT ''`,
    );
  }
  if (!ot.has("start_time")) {
    db.exec(
      `ALTER TABLE online_tests ADD COLUMN start_time TEXT NOT NULL DEFAULT ''`,
    );
  }
  if (!ot.has("end_time")) {
    db.exec(
      `ALTER TABLE online_tests ADD COLUMN end_time TEXT NOT NULL DEFAULT ''`,
    );
  }
  if (!ot.has("duration")) {
    db.exec(`ALTER TABLE online_tests ADD COLUMN duration TEXT`);
  }
  if (!ot.has("negative_marking")) {
    db.exec(
      `ALTER TABLE online_tests ADD COLUMN negative_marking TEXT DEFAULT '-0.25/wrong'`,
    );
  }

  db.exec(`
CREATE TABLE IF NOT EXISTS exam_questions (
  id TEXT PRIMARY KEY,
  online_test_id TEXT NOT NULL REFERENCES online_tests(id) ON DELETE CASCADE,
  score TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('checkbox', 'radio', 'text')),
  question_body TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS exam_answer_options (
  id TEXT PRIMARY KEY,
  exam_question_id TEXT NOT NULL REFERENCES exam_questions(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  correct INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_exam_questions_test ON exam_questions(online_test_id);
CREATE INDEX IF NOT EXISTS idx_exam_answer_options_q ON exam_answer_options(exam_question_id);

CREATE TABLE IF NOT EXISTS exam_attempts (
  id TEXT PRIMARY KEY,
  candidate_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  online_test_id TEXT NOT NULL REFERENCES online_tests(id) ON DELETE CASCADE,
  started_at TEXT NOT NULL,
  duration_seconds INTEGER NOT NULL,
  ends_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'timed_out')),
  completed_at TEXT
);

CREATE TABLE IF NOT EXISTS exam_attempt_answers (
  id TEXT PRIMARY KEY,
  attempt_id TEXT NOT NULL REFERENCES exam_attempts(id) ON DELETE CASCADE,
  exam_question_id TEXT NOT NULL,
  answer_json TEXT NOT NULL DEFAULT '{}',
  skipped INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (attempt_id, exam_question_id)
);

CREATE INDEX IF NOT EXISTS idx_exam_attempts_candidate ON exam_attempts(candidate_id);
CREATE INDEX IF NOT EXISTS idx_exam_attempts_test ON exam_attempts(online_test_id);
`);

  /** Remove legacy seeded rows (`demo-1` …); cascades to questions/attempts. Idempotent. */
  db.prepare(`DELETE FROM online_tests WHERE id LIKE 'demo-%'`).run();
}
