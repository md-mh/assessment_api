import { randomUUID } from "node:crypto";
import { db } from "../../db/index.js";
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
export function listOnlineTestsForUser(employerId) {
    return db
        .prepare(`${listOnlineTestsSelect}
    WHERE ot.employer_id IS NULL OR ot.employer_id = ?
    ORDER BY ot.created_at DESC
  `)
        .all(employerId);
}
/**
 * Candidate dashboard: every employer’s tests that already have at least one question
 * (takeable exams only — no empty shells).
 */
export function listOnlineTestsWithQuestionsForCandidates() {
    return db
        .prepare(`${listOnlineTestsSelect}
    WHERE EXISTS (
      SELECT 1 FROM exam_questions q WHERE q.online_test_id = ot.id
    )
    ORDER BY ot.created_at DESC
  `)
        .all();
}
export function getOnlineTestById(id) {
    return db
        .prepare(`
    SELECT id, employer_id, title, candidates_display, question_sets_display, exam_slots_display,
           question_type, start_time, end_time, duration
    FROM online_tests WHERE id = ?
  `)
        .get(id);
}
export function createOnlineTestForEmployer(input) {
    const id = randomUUID();
    db.prepare(`
    INSERT INTO online_tests (
      id, employer_id, title,
      candidates_display, question_sets_display, exam_slots_display,
      question_type, start_time, end_time, duration
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, input.employerId, input.onlineTestTitle.trim(), input.totalCandidates.trim(), input.totalSlots.trim(), input.totalQuestionSet.trim(), input.questionType.trim(), input.startTime.trim(), input.endTime.trim(), input.duration?.trim() || null);
    return { id };
}
export function employerOwnsTest(employerId, testId) {
    const row = db
        .prepare(`SELECT employer_id FROM online_tests WHERE id = ?`)
        .get(testId);
    return row !== undefined && row.employer_id === employerId;
}
export function countExamQuestionsForTest(onlineTestId) {
    const row = db
        .prepare(`SELECT COUNT(*) as c FROM exam_questions WHERE online_test_id = ?`)
        .get(onlineTestId);
    return row.c;
}
export function listExamQuestions(onlineTestId) {
    return db
        .prepare(`
    SELECT id, score, question_type, question_body, sort_order
    FROM exam_questions WHERE online_test_id = ?
    ORDER BY sort_order ASC, created_at ASC
  `)
        .all(onlineTestId);
}
export function listAnswerOptions(examQuestionId) {
    return db
        .prepare(`
    SELECT id, body, correct, sort_order FROM exam_answer_options
    WHERE exam_question_id = ?
    ORDER BY sort_order ASC
  `)
        .all(examQuestionId);
}
export function getExamQuestionMeta(questionId) {
    return db
        .prepare(`SELECT online_test_id, sort_order FROM exam_questions WHERE id = ?`)
        .get(questionId);
}
export function saveExamQuestion(input) {
    const existing = getExamQuestionMeta(input.questionId);
    const run = db.transaction(() => {
        if (existing) {
            db.prepare(`
        UPDATE exam_questions SET
          score = ?,
          question_type = ?,
          question_body = ?,
          sort_order = ?
        WHERE id = ?
      `).run(input.score, input.questionType, input.questionBody, input.sortOrder, input.questionId);
        }
        else {
            db.prepare(`
        INSERT INTO exam_questions (id, online_test_id, score, question_type, question_body, sort_order)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(input.questionId, input.onlineTestId, input.score, input.questionType, input.questionBody, input.sortOrder);
        }
        db.prepare(`DELETE FROM exam_answer_options WHERE exam_question_id = ?`).run(input.questionId);
        const insertOpt = db.prepare(`
      INSERT INTO exam_answer_options (id, exam_question_id, body, correct, sort_order)
      VALUES (?, ?, ?, ?, ?)
    `);
        input.options.forEach((o, i) => {
            insertOpt.run(o.id, input.questionId, o.body, o.correct ? 1 : 0, i);
        });
    });
    run();
}
export function deleteExamQuestion(questionId) {
    db.prepare(`DELETE FROM exam_questions WHERE id = ?`).run(questionId);
}
//# sourceMappingURL=online-tests.repository.js.map