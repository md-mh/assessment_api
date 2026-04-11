import { z } from "zod";

export const saveAnswerBodySchema = z.object({
  questionId: z.string().min(1),
  skipped: z.boolean().optional(),
  selectedOptionIds: z.array(z.string()).optional(),
  textAnswer: z.string().optional(),
});

export type SaveAnswerBody = z.infer<typeof saveAnswerBodySchema>;
