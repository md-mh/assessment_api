import { randomUUID } from "node:crypto";
import { db } from "../../db/index.js";
import {
  listAnswerOptions,
  listExamQuestions,
} from "../online-tests/online-tests.repository.js";

export type ExamAttemptRow = {
  id: string;
  candidate_id: string;
  online_test_id: string;
  started_at: string;
  duration_seconds: number;
  ends_at: string;
  status: "in_progress" | "completed" | "timed_out";
  completed_at: string | null;
};

export function getOnlineTestMeta(testId: string):
  | {
      id: string;
      title: string;
      duration: string | null;
      employer_id: string | null;
    }
  | undefined {
  return db
    .prepare(
      `SELECT id, title, duration, employer_id FROM online_tests WHERE id = ?`,
    )
    .get(testId) as
    | {
        id: string;
        title: string;
        duration: string | null;
        employer_id: string | null;
      }
    | undefined;
}

export function findActiveAttempt(
  candidateId: string,
  testId: string,
): ExamAttemptRow | undefined {
  return db
    .prepare(
      `
    SELECT id, candidate_id, online_test_id, started_at, duration_seconds, ends_at, status, completed_at
    FROM exam_attempts
    WHERE candidate_id = ? AND online_test_id = ? AND status = 'in_progress'
    LIMIT 1
  `,
    )
    .get(candidateId, testId) as ExamAttemptRow | undefined;
}

export function getAttemptById(attemptId: string): ExamAttemptRow | undefined {
  return db
    .prepare(
      `
    SELECT id, candidate_id, online_test_id, started_at, duration_seconds, ends_at, status, completed_at
    FROM exam_attempts WHERE id = ?
  `,
    )
    .get(attemptId) as ExamAttemptRow | undefined;
}

export function insertAttempt(input: {
  candidateId: string;
  testId: string;
  durationSeconds: number;
  endsAtIso: string;
}): { id: string } {
  const id = randomUUID();
  const started = new Date().toISOString();
  db.prepare(
    `
    INSERT INTO exam_attempts (id, candidate_id, online_test_id, started_at, duration_seconds, ends_at, status)
    VALUES (?, ?, ?, ?, ?, ?, 'in_progress')
  `,
  ).run(
    id,
    input.candidateId,
    input.testId,
    started,
    input.durationSeconds,
    input.endsAtIso,
  );
  return { id };
}

export function setAttemptStatus(
  attemptId: string,
  status: "completed" | "timed_out",
): void {
  db.prepare(
    `
    UPDATE exam_attempts SET status = ?, completed_at = datetime('now') WHERE id = ?
  `,
  ).run(status, attemptId);
}

export function listOrderedQuestionIds(testId: string): string[] {
  const rows = listExamQuestions(testId);
  return rows.map((r) => r.id);
}

export type PublicQuestion = {
  id: string;
  questionType: "checkbox" | "radio" | "text";
  questionBody: string;
  options: { id: string; body: string }[];
};

export function buildPublicQuestion(questionId: string): PublicQuestion | null {
  const row = db
    .prepare(
      `SELECT id, question_type, question_body FROM exam_questions WHERE id = ?`,
    )
    .get(questionId) as
    | { id: string; question_type: string; question_body: string }
    | undefined;
  if (!row) return null;
  const opts = listAnswerOptions(questionId);
  return {
    id: row.id,
    questionType: row.question_type as "checkbox" | "radio" | "text",
    questionBody: row.question_body,
    options: opts.map((o) => ({ id: o.id, body: o.body })),
  };
}

export function getSavedAnswerJson(
  attemptId: string,
  questionId: string,
): { answerJson: string; skipped: number } | undefined {
  return db
    .prepare(
      `
    SELECT answer_json as answerJson, skipped FROM exam_attempt_answers
    WHERE attempt_id = ? AND exam_question_id = ?
  `,
    )
    .get(attemptId, questionId) as
    | { answerJson: string; skipped: number }
    | undefined;
}

export function upsertAttemptAnswer(input: {
  attemptId: string;
  questionId: string;
  answerJson: string;
  skipped: boolean;
}): void {
  const run = db.transaction(() => {
    db.prepare(
      `DELETE FROM exam_attempt_answers WHERE attempt_id = ? AND exam_question_id = ?`,
    ).run(input.attemptId, input.questionId);
    db.prepare(
      `
      INSERT INTO exam_attempt_answers (id, attempt_id, exam_question_id, answer_json, skipped, updated_at)
      VALUES (?, ?, ?, ?, ?, datetime('now'))
    `,
    ).run(
      randomUUID(),
      input.attemptId,
      input.questionId,
      input.answerJson,
      input.skipped ? 1 : 0,
    );
  });
  run();
}
