import { AppError } from "../../utils/AppError.js";
import { parseDurationToSeconds } from "../../utils/exam-duration.js";
import {
  buildPublicQuestion,
  findActiveAttempt,
  getAttemptById,
  getOnlineTestMeta,
  getSavedAnswerJson,
  insertAttempt,
  listOrderedQuestionIds,
  setAttemptStatus,
  upsertAttemptAnswer,
} from "./candidate-exams.repository.js";
import { countExamQuestionsForTest } from "../online-tests/online-tests.repository.js";
import type { SaveAnswerBody } from "./candidate-exams.validation.js";

function assertCandidateOwnsAttempt(
  candidateId: string,
  attemptId: string,
) {
  const row = getAttemptById(attemptId);
  if (!row) {
    throw new AppError("Attempt not found", 404, "NOT_FOUND");
  }
  if (row.candidate_id !== candidateId) {
    throw new AppError("Forbidden", 403, "FORBIDDEN");
  }
  return row;
}

function assertInProgress(row: {
  id: string;
  status: string;
  ends_at: string;
}): void {
  if (row.status !== "in_progress") {
    throw new AppError("This attempt is no longer active", 410, "GONE");
  }
  if (new Date() > new Date(row.ends_at)) {
    setAttemptStatus(row.id, "timed_out");
    throw new AppError("Time is up", 410, "TIME_UP");
  }
}

export function startExamForCandidate(candidateId: string, testId: string) {
  const meta = getOnlineTestMeta(testId);
  if (!meta) {
    throw new AppError("Online test not found", 404, "NOT_FOUND");
  }

  const total = countExamQuestionsForTest(testId);
  if (total === 0) {
    throw new AppError("This test has no questions yet", 400, "NO_QUESTIONS");
  }

  const existing = findActiveAttempt(candidateId, testId);
  if (existing) {
    if (new Date() > new Date(existing.ends_at)) {
      setAttemptStatus(existing.id, "timed_out");
    } else {
      return {
        attemptId: existing.id,
        testId: meta.id,
        testTitle: meta.title,
        totalQuestions: total,
        durationSeconds: existing.duration_seconds,
        endsAt: existing.ends_at,
        resumed: true as const,
      };
    }
  }

  const durationSeconds = parseDurationToSeconds(meta.duration);
  const endsAt = new Date(
    Date.now() + durationSeconds * 1000,
  ).toISOString();

  const { id } = insertAttempt({
    candidateId,
    testId,
    durationSeconds,
    endsAtIso: endsAt,
  });

  return {
    attemptId: id,
    testId: meta.id,
    testTitle: meta.title,
    totalQuestions: total,
    durationSeconds,
    endsAt,
    resumed: false as const,
  };
}

export function getAttemptSummary(candidateId: string, attemptId: string) {
  const row = assertCandidateOwnsAttempt(candidateId, attemptId);
  if (row.status === "in_progress" && new Date() > new Date(row.ends_at)) {
    setAttemptStatus(attemptId, "timed_out");
    throw new AppError("Time is up", 410, "TIME_UP");
  }
  const meta = getOnlineTestMeta(row.online_test_id);
  const total = countExamQuestionsForTest(row.online_test_id);
  return {
    attemptId: row.id,
    testId: row.online_test_id,
    testTitle: meta?.title ?? "",
    status: row.status,
    totalQuestions: total,
    durationSeconds: row.duration_seconds,
    endsAt: row.ends_at,
  };
}

export function getQuestionAtIndex(
  candidateId: string,
  attemptId: string,
  questionIndex: number,
) {
  const row = assertCandidateOwnsAttempt(candidateId, attemptId);
  assertInProgress(row);

  const ids = listOrderedQuestionIds(row.online_test_id);
  if (questionIndex < 0 || questionIndex >= ids.length) {
    throw new AppError("Invalid question index", 400, "BAD_INDEX");
  }

  const questionId = ids[questionIndex]!;
  const q = buildPublicQuestion(questionId);
  if (!q) {
    throw new AppError("Question not found", 404, "NOT_FOUND");
  }

  const saved = getSavedAnswerJson(attemptId, questionId);
  let savedAnswer: {
    selectedOptionIds: string[];
    textAnswer: string;
  } | null = null;
  if (saved && !saved.skipped) {
    try {
      const parsed = JSON.parse(saved.answerJson) as {
        selectedOptionIds?: string[];
        text?: string;
      };
      savedAnswer = {
        selectedOptionIds: parsed.selectedOptionIds ?? [],
        textAnswer: parsed.text ?? "",
      };
    } catch {
      savedAnswer = { selectedOptionIds: [], textAnswer: "" };
    }
  }

  return {
    index: questionIndex,
    total: ids.length,
    question: q,
    savedAnswer,
    skipped: saved ? saved.skipped === 1 : false,
  };
}

export function saveAnswer(
  candidateId: string,
  attemptId: string,
  body: SaveAnswerBody,
) {
  const row = assertCandidateOwnsAttempt(candidateId, attemptId);
  assertInProgress(row);

  const ids = listOrderedQuestionIds(row.online_test_id);
  const idx = ids.indexOf(body.questionId);
  if (idx < 0) {
    throw new AppError("Invalid question", 400, "BAD_QUESTION");
  }

  const skipped = Boolean(body.skipped);
  const payload = {
    selectedOptionIds: body.selectedOptionIds ?? [],
    text: body.textAnswer ?? "",
  };
  const answerJson = JSON.stringify(payload);

  upsertAttemptAnswer({
    attemptId,
    questionId: body.questionId,
    answerJson,
    skipped,
  });

  const isLast = idx === ids.length - 1;
  return { savedIndex: idx, isLastQuestion: isLast };
}

export function completeExam(candidateId: string, attemptId: string) {
  const row = assertCandidateOwnsAttempt(candidateId, attemptId);
  if (row.status !== "in_progress") {
    throw new AppError("Attempt already finished", 410, "GONE");
  }
  setAttemptStatus(attemptId, "completed");
  const meta = getOnlineTestMeta(row.online_test_id);
  return {
    testTitle: meta?.title ?? "",
    testId: row.online_test_id,
  };
}

export function markTimedOut(candidateId: string, attemptId: string) {
  const row = assertCandidateOwnsAttempt(candidateId, attemptId);
  if (row.status === "in_progress") {
    setAttemptStatus(attemptId, "timed_out");
  }
}
