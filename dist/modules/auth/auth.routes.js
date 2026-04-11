import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { validateBody } from "../../middleware/validate.js";
import { authController } from "./auth.controller.js";
import { loginBodySchema, registerBodySchema, } from "./auth.validation.js";
export const authRouter = Router();
authRouter.post("/register", validateBody(registerBodySchema), authController.register);
authRouter.post("/login", validateBody(loginBodySchema), authController.login);
authRouter.get("/me", authenticate, authController.me);
//# sourceMappingURL=auth.routes.js.map