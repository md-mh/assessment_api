import { asyncHandler } from "../../utils/async-handler.js";
import { getSessionUser, loginUser, registerUser, } from "./auth.service.js";
export const authController = {
    register: asyncHandler(async (req, res) => {
        const { confirmPassword: _c, ...rest } = req.body;
        const result = await registerUser(rest);
        res.status(201).json({
            user: result.user,
            token: result.token,
        });
    }),
    login: asyncHandler(async (req, res) => {
        const result = await loginUser(req.body);
        res.json({
            user: result.user,
            token: result.token,
        });
    }),
    me: asyncHandler(async (req, res) => {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const user = getSessionUser(userId);
        res.json({ user });
    }),
};
//# sourceMappingURL=auth.controller.js.map