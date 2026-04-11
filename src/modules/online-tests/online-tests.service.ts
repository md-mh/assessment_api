import { AppError } from "../../utils/AppError.js";
import type {
  CreateOnlineTestBody,
  ExamQuestionBody,
} from "./online-tests.validation.js";
import {
  createOnlineTestForEmployer,
  deleteExamQuestion,
  employerOwnsTest,
  getExamQuestionMeta,
  getOnlineTestById,
  listAnswerOptions,
  listExamQuestions,
  listOnlineTestsForUser,
  listOnlineTestsWithQuestionsForCandidates,
  saveExamQuestion,
  type OnlineTestRow,
} from "./online-tests.repository.js";

function formatDurationForCandidate(duration: string | null): string {
  if (duration === null || String(duration).trim() === "") {
    return "30 min";
  }
  const t = String(duration).trim();
  if (/\bmin\b/i.test(t)) return t;
  if (/^\d+(\.\d+)?$/.test(t)) return `${t} min`;
  return t;
}

function mapOnlineTestRows(rows: OnlineTestRow[]) {
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    candidates: r.candidates_display,
    questionSets: r.question_sets_display,
    examSlots: r.exam_slots_display,
    duration: formatDurationForCandidate(r.duration),
    questionCount: String(r.question_count),
    negativeMarking: r.negative_marking?.trim() || "-0.25/wrong",
  }));
}

export function listTestsForEmployer(employerId: string) {
  return mapOnlineTestRows(listOnlineTestsForUser(employerId));
}

/** Candidates: DB-backed tests that have ≥1 question (same rows employers built). */
export function listTestsForCandidate() {
  return mapOnlineTestRows(listOnlineTestsWithQuestionsForCandidates());
}

export function createTest(employerId: string, body: CreateOnlineTestBody) {
  return createOnlineTestForEmployer({
    employerId,
    onlineTestTitle: body.onlineTestTitle,
    totalCandidates: body.totalCandidates,
    totalSlots: body.totalSlots,
    totalQuestionSet: body.totalQuestionSet,
    questionType: body.questionType,
    startTime: body.startTime,
    endTime: body.endTime,
    duration: body.duration,
  });
}

export function getTestDetail(employerId: string, testId: string) {
  const row = getOnlineTestById(testId);
  if (!row) {
    throw new AppError("Online test not found", 404, "NOT_FOUND");
  }
  const canSee =
    row.employer_id === null || row.employer_id === employerId;
  if (!canSee) {
    throw new AppError("Forbidden", 403, "FORBIDDEN");
  }
  return {
    id: row.id,
    onlineTestTitle: row.title,
    totalCandidates: row.candidates_display,
    totalSlots: row.exam_slots_display,
    totalQuestionSet: row.question_sets_display,
    questionType: row.question_type,
    startTime: row.start_time,
    endTime: row.end_time,
    duration: row.duration ?? "",
  };
}

export function listQuestionsForTest(employerId: string, testId: string) {
  const row = getOnlineTestById(testId);
  if (!row) {
    throw new AppError("Online test not found", 404, "NOT_FOUND");
  }
  const canSee =
    row.employer_id === null || row.employer_id === employerId;
  if (!canSee) {
    throw new AppError("Forbidden", 403, "FORBIDDEN");
  }

  const qRows = listExamQuestions(testId);
  const items = qRows.map((q) => {
    const opts = listAnswerOptions(q.id);
    return {
      id: q.id,
      score: q.score,
      questionType: q.question_type as "checkbox" | "radio" | "text",
      questionBody: q.question_body,
      options: opts.map((o) => ({
        id: o.id,
        body: o.body,
        correct: o.correct === 1,
      })),
    };
  });
  return { items };
}

export function addOrUpdateQuestion(
  employerId: string,
  testId: string,
  body: Omit<ExamQuestionBody, "sortOrder">,
  sortOrder: number,
) {
  if (!employerOwnsTest(employerId, testId)) {
    throw new AppError(
      "You can only add questions to your own online tests",
      403,
      "FORBIDDEN",
    );
  }

  const meta = getExamQuestionMeta(body.id);
  if (meta && meta.online_test_id !== testId) {
    throw new AppError("Question belongs to another test", 409, "CONFLICT");
  }

  saveExamQuestion({
    onlineTestId: testId,
    questionId: body.id,
    score: body.score,
    questionType: body.questionType,
    questionBody: body.questionBody,
    sortOrder,
    options: body.options.map((o) => ({
      id: o.id,
      body: o.body,
      correct: o.correct,
    })),
  });

  return { id: body.id };
}

export function removeQuestion(
  employerId: string,
  testId: string,
  questionId: string,
) {
  if (!employerOwnsTest(employerId, testId)) {
    throw new AppError(
      "You can only modify your own online tests",
      403,
      "FORBIDDEN",
    );
  }
  const meta = getExamQuestionMeta(questionId);
  if (!meta || meta.online_test_id !== testId) {
    throw new AppError("Question not found", 404, "NOT_FOUND");
  }
  deleteExamQuestion(questionId);
}
