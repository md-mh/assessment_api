import type { CreateOnlineTestBody, ExamQuestionBody } from "./online-tests.validation.js";
export declare function listTestsForEmployer(employerId: string): {
    id: string;
    title: string;
    candidates: string;
    questionSets: string;
    examSlots: string;
    duration: string;
    questionCount: string;
    negativeMarking: string;
}[];
/** Candidates: DB-backed tests that have ≥1 question (same rows employers built). */
export declare function listTestsForCandidate(): {
    id: string;
    title: string;
    candidates: string;
    questionSets: string;
    examSlots: string;
    duration: string;
    questionCount: string;
    negativeMarking: string;
}[];
export declare function createTest(employerId: string, body: CreateOnlineTestBody): {
    id: string;
};
export declare function getTestDetail(employerId: string, testId: string): {
    id: string;
    onlineTestTitle: string;
    totalCandidates: string;
    totalSlots: string;
    totalQuestionSet: string;
    questionType: string;
    startTime: string;
    endTime: string;
    duration: string;
};
export declare function listQuestionsForTest(employerId: string, testId: string): {
    items: {
        id: string;
        score: string;
        questionType: "checkbox" | "radio" | "text";
        questionBody: string;
        options: {
            id: string;
            body: string;
            correct: boolean;
        }[];
    }[];
};
export declare function addOrUpdateQuestion(employerId: string, testId: string, body: Omit<ExamQuestionBody, "sortOrder">, sortOrder: number): {
    id: string;
};
export declare function removeQuestion(employerId: string, testId: string, questionId: string): void;
//# sourceMappingURL=online-tests.service.d.ts.map