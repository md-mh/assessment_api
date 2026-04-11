import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { requireRole } from "../../middleware/require-role.js";
import { validateBody } from "../../middleware/validate.js";
import { onlineTestsController } from "./online-tests.controller.js";
import {
  createOnlineTestBodySchema,
  examQuestionBodySchema,
} from "./online-tests.validation.js";

export const onlineTestsRouter = Router();

onlineTestsRouter.get("/", authenticate, onlineTestsController.list);

onlineTestsRouter.post(
  "/",
  authenticate,
  requireRole("employer"),
  validateBody(createOnlineTestBodySchema),
  onlineTestsController.create,
);

onlineTestsRouter.get(
  "/:id/questions",
  authenticate,
  onlineTestsController.listQuestions,
);

onlineTestsRouter.post(
  "/:id/questions",
  authenticate,
  requireRole("employer"),
  validateBody(examQuestionBodySchema),
  onlineTestsController.saveQuestion,
);

onlineTestsRouter.delete(
  "/:id/questions/:questionId",
  authenticate,
  requireRole("employer"),
  onlineTestsController.deleteQuestion,
);

onlineTestsRouter.get("/:id", authenticate, onlineTestsController.getOne);
