import "dotenv/config";
import { z } from "zod";
declare const envSchema: z.ZodObject<{
    NODE_ENV: z.ZodDefault<z.ZodEnum<["development", "production", "test"]>>;
    PORT: z.ZodDefault<z.ZodNumber>;
    JWT_SECRET: z.ZodDefault<z.ZodString>;
    DATABASE_PATH: z.ZodDefault<z.ZodString>;
    CORS_ORIGIN: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    NODE_ENV: "development" | "production" | "test";
    PORT: number;
    JWT_SECRET: string;
    DATABASE_PATH: string;
    CORS_ORIGIN: string;
}, {
    NODE_ENV?: "development" | "production" | "test" | undefined;
    PORT?: number | undefined;
    JWT_SECRET?: string | undefined;
    DATABASE_PATH?: string | undefined;
    CORS_ORIGIN?: string | undefined;
}>;
export type Env = z.infer<typeof envSchema>;
export declare const env: {
    NODE_ENV: "development" | "production" | "test";
    PORT: number;
    JWT_SECRET: string;
    DATABASE_PATH: string;
    CORS_ORIGIN: string;
};
export {};
//# sourceMappingURL=env.d.ts.map