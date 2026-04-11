import { ZodError } from "zod";
export function validateBody(schema) {
    return (req, res, next) => {
        try {
            req.body = schema.parse(req.body);
            next();
        }
        catch (err) {
            if (err instanceof ZodError) {
                res.status(400).json({
                    error: "Validation failed",
                    details: err.flatten().fieldErrors,
                });
                return;
            }
            next(err);
        }
    };
}
//# sourceMappingURL=validate.js.map