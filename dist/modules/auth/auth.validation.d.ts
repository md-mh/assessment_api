import { z } from "zod";
export declare const registerBodySchema: z.ZodEffects<z.ZodObject<{
    fullName: z.ZodString;
    email: z.ZodString;
    role: z.ZodEnum<["employer", "candidate"]>;
    password: z.ZodString;
    confirmPassword: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    fullName: string;
    role: "employer" | "candidate";
    password: string;
    confirmPassword: string;
}, {
    email: string;
    fullName: string;
    role: "employer" | "candidate";
    password: string;
    confirmPassword: string;
}>, {
    email: string;
    fullName: string;
    role: "employer" | "candidate";
    password: string;
    confirmPassword: string;
}, {
    email: string;
    fullName: string;
    role: "employer" | "candidate";
    password: string;
    confirmPassword: string;
}>;
export declare const loginBodySchema: z.ZodEffects<z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export type RegisterBody = z.infer<typeof registerBodySchema>;
export type LoginBody = z.infer<typeof loginBodySchema>;
//# sourceMappingURL=auth.validation.d.ts.map