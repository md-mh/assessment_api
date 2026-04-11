import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { requireRole } from "../../middleware/require-role.js";
import { validateBody } from "../../middleware/validate.js";
import { candidateExamsController } from "./candidate-exams.controller.js";
import { saveAnswerBodySchema } from "./candidate-exams.validation.js";
export const candidateExamsRouter = Router();
candidateExamsRouter.use(authenticate, requireRole("candidate"));
candidateExamsRouter.get("/attempts/:attemptId", candidateExamsController.getAttempt);
candidateExamsRouter.get("/attempts/:attemptId/questions/:questionIndex", candidateExamsController.getQuestion);
candidateExamsRouter.post("/attempts/:attemptId/answers", validateBody(saveAnswerBodySchema), candidateExamsController.postAnswer);
candidateExamsRouter.post("/attempts/:attemptId/complete", candidateExamsController.complete);
candidateExamsRouter.post("/attempts/:attemptId/timeout", candidateExamsController.timeout);
candidateExamsRouter.post("/:testId/start", candidateExamsController.start);
//# sourceMappingURL=candidate-exams.routes.js.map