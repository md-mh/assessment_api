import { z } from "zod";
export const createOnlineTestBodySchema = z.object({
    onlineTestTitle: z.string().trim().min(1, "Online test title is required"),
    totalCandidates: z
        .string()
        .trim()
        .regex(/^\d+$/, "Enter a valid number for total candidates"),
    totalSlots: z.string().trim().min(1, "Total slots is required"),
    totalQuestionSet: z.string().trim().min(1, "Total question set is required"),
    questionType: z.string().trim().min(1, "Question type is required"),
    startTime: z.string().trim().min(1, "Start time is required"),
    endTime: z.string().trim().min(1, "End time is required"),
    duration: z.string().trim().optional(),
});
const answerOptionSchema = z.object({
    id: z.string().min(1),
    body: z.string(),
    correct: z.boolean(),
});
export const examQuestionBodySchema = z.object({
    id: z.string().min(1),
    score: z.string().min(1),
    questionType: z.enum(["checkbox", "radio", "text"]),
    questionBody: z.string(),
    options: z.array(answerOptionSchema),
    /** If omitted, the server appends after existing questions */
    sortOrder: z.number().int().min(0).optional(),
});
//# sourceMappingURL=online-tests.validation.js.map