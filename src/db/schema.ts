export const INIT_SQL = `
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('employer', 'candidate')),
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS online_tests (
  id TEXT PRIMARY KEY,
  employer_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  candidates_display TEXT NOT NULL,
  question_sets_display TEXT NOT NULL,
  exam_slots_display TEXT NOT NULL,
  question_type TEXT NOT NULL DEFAULT '',
  start_time TEXT NOT NULL DEFAULT '',
  end_time TEXT NOT NULL DEFAULT '',
  duration TEXT,
  negative_marking TEXT DEFAULT '-0.25/wrong',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_online_tests_employer ON online_tests(employer_id);
`;
