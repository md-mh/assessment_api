import type { SaveAnswerBody } from "./candidate-exams.validation.js";
export declare function startExamForCandidate(candidateId: string, testId: string): {
    attemptId: string;
    testId: string;
    testTitle: string;
    totalQuestions: number;
    durationSeconds: number;
    endsAt: string;
    resumed: true;
} | {
    attemptId: string;
    testId: string;
    testTitle: string;
    totalQuestions: number;
    durationSeconds: number;
    endsAt: string;
    resumed: false;
};
export declare function getAttemptSummary(candidateId: string, attemptId: string): {
    attemptId: string;
    testId: string;
    testTitle: string;
    status: "in_progress" | "completed" | "timed_out";
    totalQuestions: number;
    durationSeconds: number;
    endsAt: string;
};
export declare function getQuestionAtIndex(candidateId: string, attemptId: string, questionIndex: number): {
    index: number;
    total: number;
    question: import("./candidate-exams.repository.js").PublicQuestion;
    savedAnswer: {
        selectedOptionIds: string[];
        textAnswer: string;
    } | null;
    skipped: boolean;
};
export declare function saveAnswer(candidateId: string, attemptId: string, body: SaveAnswerBody): {
    savedIndex: number;
    isLastQuestion: boolean;
};
export declare function completeExam(candidateId: string, attemptId: string): {
    testTitle: string;
    testId: string;
};
export declare function markTimedOut(candidateId: string, attemptId: string): void;
//# sourceMappingURL=candidate-exams.service.d.ts.map