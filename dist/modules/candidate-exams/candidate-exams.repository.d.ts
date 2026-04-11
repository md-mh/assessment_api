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
export declare function getOnlineTestMeta(testId: string): {
    id: string;
    title: string;
    duration: string | null;
    employer_id: string | null;
} | undefined;
export declare function findActiveAttempt(candidateId: string, testId: string): ExamAttemptRow | undefined;
export declare function getAttemptById(attemptId: string): ExamAttemptRow | undefined;
export declare function insertAttempt(input: {
    candidateId: string;
    testId: string;
    durationSeconds: number;
    endsAtIso: string;
}): {
    id: string;
};
export declare function setAttemptStatus(attemptId: string, status: "completed" | "timed_out"): void;
export declare function listOrderedQuestionIds(testId: string): string[];
export type PublicQuestion = {
    id: string;
    questionType: "checkbox" | "radio" | "text";
    questionBody: string;
    options: {
        id: string;
        body: string;
    }[];
};
export declare function buildPublicQuestion(questionId: string): PublicQuestion | null;
export declare function getSavedAnswerJson(attemptId: string, questionId: string): {
    answerJson: string;
    skipped: number;
} | undefined;
export declare function upsertAttemptAnswer(input: {
    attemptId: string;
    questionId: string;
    answerJson: string;
    skipped: boolean;
}): void;
//# sourceMappingURL=candidate-exams.repository.d.ts.map