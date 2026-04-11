import { randomUUID } from "node:crypto";
import { db } from "../../db/index.js";
import { listAnswerOptions, listExamQuestions, } from "../online-tests/online-tests.repository.js";
export function getOnlineTestMeta(testId) {
    return db
        .prepare(`SELECT id, title, duration, employer_id FROM online_tests WHERE id = ?`)
        .get(testId);
}
export function findActiveAttempt(candidateId, testId) {
    return db
        .prepare(`
    SELECT id, candidate_id, online_test_id, started_at, duration_seconds, ends_at, status, completed_at
    FROM exam_attempts
    WHERE candidate_id = ? AND online_test_id = ? AND status = 'in_progress'
    LIMIT 1
  `)
        .get(candidateId, testId);
}
export function getAttemptById(attemptId) {
    return db
        .prepare(`
    SELECT id, candidate_id, online_test_id, started_at, duration_seconds, ends_at, status, completed_at
    FROM exam_attempts WHERE id = ?
  `)
        .get(attemptId);
}
export function insertAttempt(input) {
    const id = randomUUID();
    const started = new Date().toISOString();
    db.prepare(`
    INSERT INTO exam_attempts (id, candidate_id, online_test_id, started_at, duration_seconds, ends_at, status)
    VALUES (?, ?, ?, ?, ?, ?, 'in_progress')
  `).run(id, input.candidateId, input.testId, started, input.durationSeconds, input.endsAtIso);
    return { id };
}
export function setAttemptStatus(attemptId, status) {
    db.prepare(`
    UPDATE exam_attempts SET status = ?, completed_at = datetime('now') WHERE id = ?
  `).run(status, attemptId);
}
export function listOrderedQuestionIds(testId) {
    const rows = listExamQuestions(testId);
    return rows.map((r) => r.id);
}
export function buildPublicQuestion(questionId) {
    const row = db
        .prepare(`SELECT id, question_type, question_body FROM exam_questions WHERE id = ?`)
        .get(questionId);
    if (!row)
        return null;
    const opts = listAnswerOptions(questionId);
    return {
        id: row.id,
        questionType: row.question_type,
        questionBody: row.question_body,
        options: opts.map((o) => ({ id: o.id, body: o.body })),
    };
}
export function getSavedAnswerJson(attemptId, questionId) {
    return db
        .prepare(`
    SELECT answer_json as answerJson, skipped FROM exam_attempt_answers
    WHERE attempt_id = ? AND exam_question_id = ?
  `)
        .get(attemptId, questionId);
}
export function upsertAttemptAnswer(input) {
    const run = db.transaction(() => {
        db.prepare(`DELETE FROM exam_attempt_answers WHERE attempt_id = ? AND exam_question_id = ?`).run(input.attemptId, input.questionId);
        db.prepare(`
      INSERT INTO exam_attempt_answers (id, attempt_id, exam_question_id, answer_json, skipped, updated_at)
      VALUES (?, ?, ?, ?, ?, datetime('now'))
    `).run(randomUUID(), input.attemptId, input.questionId, input.answerJson, input.skipped ? 1 : 0);
    });
    run();
}
//# sourceMappingURL=candidate-exams.repository.js.map