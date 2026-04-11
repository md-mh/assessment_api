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
/** Employer: shared rows (employer_id NULL) + tests they created. */
export declare function listOnlineTestsForUser(employerId: string): OnlineTestRow[];
/**
 * Candidate dashboard: every employer’s tests that already have at least one question
 * (takeable exams only — no empty shells).
 */
export declare function listOnlineTestsWithQuestionsForCandidates(): OnlineTestRow[];
export declare function getOnlineTestById(id: string): {
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
} | undefined;
export declare function createOnlineTestForEmployer(input: {
    employerId: string;
    onlineTestTitle: string;
    totalCandidates: string;
    totalSlots: string;
    totalQuestionSet: string;
    questionType: string;
    startTime: string;
    endTime: string;
    duration?: string;
}): {
    id: string;
};
export declare function employerOwnsTest(employerId: string, testId: string): boolean;
export type QuestionRow = {
    id: string;
    score: string;
    question_type: string;
    question_body: string;
    sort_order: number;
};
export declare function countExamQuestionsForTest(onlineTestId: string): number;
export declare function listExamQuestions(onlineTestId: string): QuestionRow[];
export declare function listAnswerOptions(examQuestionId: string): {
    id: string;
    body: string;
    correct: number;
    sort_order: number;
}[];
export declare function getExamQuestionMeta(questionId: string): {
    online_test_id: string;
    sort_order: number;
} | undefined;
export declare function saveExamQuestion(input: {
    onlineTestId: string;
    questionId: string;
    score: string;
    questionType: "checkbox" | "radio" | "text";
    questionBody: string;
    sortOrder: number;
    options: {
        id: string;
        body: string;
        correct: boolean;
    }[];
}): void;
export declare function deleteExamQuestion(questionId: string): void;
//# sourceMappingURL=online-tests.repository.d.ts.map