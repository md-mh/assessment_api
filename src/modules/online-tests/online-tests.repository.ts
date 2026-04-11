import { randomUUID } from "node:crypto";
import { db } from "../../db/index.js";

export type OnlineTestRow = {
  id: string;
  title: string;
  candidates_display: string;
  question_sets_display: string;
  exam_slots_display: string;
  duration: string | null;
  negative_marking: string | null;
  question_count: number;
};

const listOnlineTestsSelect = `
    SELECT
      ot.id,
      ot.title,
      ot.candidates_display,
      ot.question_sets_display,
      ot.exam_slots_display,
      ot.duration,
      ot.negative_marking,
      COALESCE(
        (SELECT COUNT(*) FROM exam_questions q WHERE q.online_test_id = ot.id),
        0
      ) AS question_count
    FROM online_tests ot
`;

/** Employer: shared rows (employer_id NULL) + tests they created. */
export function listOnlineTestsForUser(employerId: string): OnlineTestRow[] {
  return db
    .prepare(
      `${listOnlineTestsSelect}
    WHERE ot.employer_id IS NULL OR ot.employer_id = ?
    ORDER BY ot.created_at DESC
  `,
    )
    .all(employerId) as OnlineTestRow[];
}

/**
 * Candidate dashboard: every employer’s tests that already have at least one question
 * (takeable exams only — no empty shells).
 */
export function listOnlineTestsWithQuestionsForCandidates(): OnlineTestRow[] {
  return db
    .prepare(
      `${listOnlineTestsSelect}
    WHERE EXISTS (
      SELECT 1 FROM exam_questions q WHERE q.online_test_id = ot.id
    )
    ORDER BY ot.created_at DESC
  `,
    )
    .all() as OnlineTestRow[];
}

export function getOnlineTestById(id: string):
  | {
      id: string;
      employer_id: string | null;
      title: string;
      candidates_display: string;
      question_sets_display: string;
      exam_slots_display: string;
      question_type: string;
      start_time: string;
      end_time: string;
      duration: string | null;
    }
  | undefined {
  return db
    .prepare(
      `
    SELECT id, employer_id, title, candidates_display, question_sets_display, exam_slots_display,
           question_type, start_time, end_time, duration
    FROM online_tests WHERE id = ?
  `,
    )
    .get(id) as
    | {
        id: string;
        employer_id: string | null;
        title: string;
        candidates_display: string;
        question_sets_display: string;
        exam_slots_display: string;
        question_type: string;
        start_time: string;
        end_time: string;
        duration: string | null;
      }
    | undefined;
}

export function createOnlineTestForEmployer(input: {
  employerId: string;
  onlineTestTitle: string;
  totalCandidates: string;
  totalSlots: string;
  totalQuestionSet: string;
  questionType: string;
  startTime: string;
  endTime: string;
  duration?: string;
}): { id: string } {
  const id = randomUUID();
  db.prepare(
    `
    INSERT INTO online_tests (
      id, employer_id, title,
      candidates_display, question_sets_display, exam_slots_display,
      question_type, start_time, end_time, duration
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
  ).run(
    id,
    input.employerId,
    input.onlineTestTitle.trim(),
    input.totalCandidates.trim(),
    input.totalSlots.trim(),
    input.totalQuestionSet.trim(),
    input.questionType.trim(),
    input.startTime.trim(),
    input.endTime.trim(),
    input.duration?.trim() || null,
  );
  return { id };
}

export function employerOwnsTest(employerId: string, testId: string): boolean {
  const row = db
    .prepare(`SELECT employer_id FROM online_tests WHERE id = ?`)
    .get(testId) as { employer_id: string | null } | undefined;
  return row !== undefined && row.employer_id === employerId;
}

export type QuestionRow = {
  id: string;
  score: string;
  question_type: string;
  question_body: string;
  sort_order: number;
};

export function countExamQuestionsForTest(onlineTestId: string): number {
  const row = db
    .prepare(
      `SELECT COUNT(*) as c FROM exam_questions WHERE online_test_id = ?`,
    )
    .get(onlineTestId) as { c: number };
  return row.c;
}

export function listExamQuestions(onlineTestId: string): QuestionRow[] {
  return db
    .prepare(
      `
    SELECT id, score, question_type, question_body, sort_order
    FROM exam_questions WHERE online_test_id = ?
    ORDER BY sort_order ASC, created_at ASC
  `,
    )
    .all(onlineTestId) as QuestionRow[];
}

export function listAnswerOptions(
  examQuestionId: string,
): { id: string; body: string; correct: number; sort_order: number }[] {
  return db
    .prepare(
      `
    SELECT id, body, correct, sort_order FROM exam_answer_options
    WHERE exam_question_id = ?
    ORDER BY sort_order ASC
  `,
    )
    .all(examQuestionId) as {
    id: string;
    body: string;
    correct: number;
    sort_order: number;
  }[];
}

export function getExamQuestionMeta(questionId: string):
  | { online_test_id: string; sort_order: number }
  | undefined {
  return db
    .prepare(
      `SELECT online_test_id, sort_order FROM exam_questions WHERE id = ?`,
    )
    .get(questionId) as
    | { online_test_id: string; sort_order: number }
    | undefined;
}

export function saveExamQuestion(input: {
  onlineTestId: string;
  questionId: string;
  score: string;
  questionType: "checkbox" | "radio" | "text";
  questionBody: string;
  sortOrder: number;
  options: { id: string; body: string; correct: boolean }[];
}): void {
  const existing = getExamQuestionMeta(input.questionId);

  const run = db.transaction(() => {
    if (existing) {
      db.prepare(
        `
        UPDATE exam_questions SET
          score = ?,
          question_type = ?,
          question_body = ?,
          sort_order = ?
        WHERE id = ?
      `,
      ).run(
        input.score,
        input.questionType,
        input.questionBody,
        input.sortOrder,
        input.questionId,
      );
    } else {
      db.prepare(
        `
        INSERT INTO exam_questions (id, online_test_id, score, question_type, question_body, sort_order)
        VALUES (?, ?, ?, ?, ?, ?)
      `,
      ).run(
        input.questionId,
        input.onlineTestId,
        input.score,
        input.questionType,
        input.questionBody,
        input.sortOrder,
      );
    }

    db.prepare(`DELETE FROM exam_answer_options WHERE exam_question_id = ?`).run(
      input.questionId,
    );

    const insertOpt = db.prepare(`
      INSERT INTO exam_answer_options (id, exam_question_id, body, correct, sort_order)
      VALUES (?, ?, ?, ?, ?)
    `);

    input.options.forEach((o, i) => {
      insertOpt.run(
        o.id,
        input.questionId,
        o.body,
        o.correct ? 1 : 0,
        i,
      );
    });
  });

  run();
}

export function deleteExamQuestion(questionId: string): void {
  db.prepare(`DELETE FROM exam_questions WHERE id = ?`).run(questionId);
}
