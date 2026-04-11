import { z } from "zod";
export declare const createOnlineTestBodySchema: z.ZodObject<{
    onlineTestTitle: z.ZodString;
    totalCandidates: z.ZodString;
    totalSlots: z.ZodString;
    totalQuestionSet: z.ZodString;
    questionType: z.ZodString;
    startTime: z.ZodString;
    endTime: z.ZodString;
    duration: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    onlineTestTitle: string;
    totalCandidates: string;
    totalSlots: string;
    totalQuestionSet: string;
    questionType: string;
    startTime: string;
    endTime: string;
    duration?: string | undefined;
}, {
    onlineTestTitle: string;
    totalCandidates: string;
    totalSlots: string;
    totalQuestionSet: string;
    questionType: string;
    startTime: string;
    endTime: string;
    duration?: string | undefined;
}>;
export type CreateOnlineTestBody = z.infer<typeof createOnlineTestBodySchema>;
export declare const examQuestionBodySchema: z.ZodObject<{
    id: z.ZodString;
    score: z.ZodString;
    questionType: z.ZodEnum<["checkbox", "radio", "text"]>;
    questionBody: z.ZodString;
    options: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        body: z.ZodString;
        correct: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        id: string;
        body: string;
        correct: boolean;
    }, {
        id: string;
        body: string;
        correct: boolean;
    }>, "many">;
    /** If omitted, the server appends after existing questions */
    sortOrder: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    options: {
        id: string;
        body: string;
        correct: boolean;
    }[];
    id: string;
    questionBody: string;
    questionType: "checkbox" | "radio" | "text";
    score: string;
    sortOrder?: number | undefined;
}, {
    options: {
        id: string;
        body: string;
        correct: boolean;
    }[];
    id: string;
    questionBody: string;
    questionType: "checkbox" | "radio" | "text";
    score: string;
    sortOrder?: number | undefined;
}>;
export type ExamQuestionBody = z.infer<typeof examQuestionBodySchema>;
//# sourceMappingURL=online-tests.validation.d.ts.map