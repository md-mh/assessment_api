import { z } from "zod";
export const registerBodySchema = z.object({
    fullName: z.string().trim().min(2, "Name must be at least 2 characters"),
    email: z.string().trim().email("Enter a valid email address"),
    role: z.enum(["employer", "candidate"]),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
});
export const loginBodySchema = z
    .object({
    email: z.string().trim().min(3, "Email or user ID is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
})
    .superRefine((data, ctx) => {
    const v = data.email;
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    const idOk = /^[a-zA-Z0-9._@-]{3,}$/.test(v);
    if (!emailOk && !idOk) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Enter a valid email or user ID",
            path: ["email"],
        });
    }
});
//# sourceMappingURL=auth.validation.js.map