import { Router } from "express";
import { authRouter } from "../modules/auth/auth.routes.js";
import { candidateExamsRouter } from "../modules/candidate-exams/candidate-exams.routes.js";
import { onlineTestsRouter } from "../modules/online-tests/online-tests.routes.js";
export const apiRouter = Router();
apiRouter.use("/auth", authRouter);
apiRouter.use("/online-tests", onlineTestsRouter);
apiRouter.use("/candidate/exams", candidateExamsRouter);
//# sourceMappingURL=index.js.map