import { z } from "zod";
export declare const saveAnswerBodySchema: z.ZodObject<{
    questionId: z.ZodString;
    skipped: z.ZodOptional<z.ZodBoolean>;
    selectedOptionIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    textAnswer: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    questionId: string;
    skipped?: boolean | undefined;
    selectedOptionIds?: string[] | undefined;
    textAnswer?: string | undefined;
}, {
    questionId: string;
    skipped?: boolean | undefined;
    selectedOptionIds?: string[] | undefined;
    textAnswer?: string | undefined;
}>;
export type SaveAnswerBody = z.infer<typeof saveAnswerBodySchema>;
//# sourceMappingURL=candidate-exams.validation.d.ts.map