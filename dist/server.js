import { createApp } from "./app.js";
import { env } from "./config/env.js";
// Ensure DB is initialized (side effect import)
import "./db/index.js";
const app = createApp();
if (process.env.VERCEL !== "1") {
    app.listen(env.PORT, () => {
        console.log(`API listening on http://localhost:${env.PORT}`);
    });
}
export default app;
//# sourceMappingURL=server.js.map