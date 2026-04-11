import { createApp } from "./app.js";
import { env } from "./config/env.js";
// Ensure DB is initialized (side effect import)
import "./db/index.js";
const app = createApp();
app.listen(env.PORT, () => {
    console.log(`API listening on http://localhost:${env.PORT}`);
});
//# sourceMappingURL=server.js.map