# Assessment API (Express)

## Scripts

- `npm run dev` — development server with hot reload (`tsx watch`)
- `npm run build` — compile TypeScript to `dist/`
- `npm start` — run compiled server from `dist/` (**always run `npm run build` first** after pulling or editing `src/`; otherwise `dist/` may still use old logic — e.g. candidate vs employer test lists).

Prefer `npm run dev` locally so the API always matches `src/` without a separate build step.

## Configuration

Copy `.env.example` to `.env` and adjust `JWT_SECRET` and `CORS_ORIGIN` for production.

SQLite database file: `data/app.db` (created on first run).

## HTTP

- `GET /health`
- `POST /api/auth/register` — body: `fullName`, `email`, `role`, `password`, `confirmPassword`
- `POST /api/auth/login` — body: `email` (must be a real email registered in the system), `password`
- `GET /api/auth/me` — header: `Authorization: Bearer <token>`
- `GET /api/online-tests` — list (demo rows + your own)
- `POST /api/online-tests` — create basic info (**employer** only); body matches frontend basic-information fields
- `GET /api/online-tests/:id` — test detail (must be allowed to see that test)
- `GET /api/online-tests/:id/questions` — list questions for a test
- `POST /api/online-tests/:id/questions` — create or update one question (**employer** only); body: `id`, `score`, `questionType`, `questionBody`, `options[]`, optional `sortOrder`
- `DELETE /api/online-tests/:id/questions/:questionId` — remove a question (**employer** only)

All of the above except register/login require header: `Authorization: Bearer <token>` where applicable.

## Create online test (curl)

Use **POST** (not GET). `--data-raw` implies POST in curl; adding `-X POST` avoids ambiguity.

```bash
curl -s -X POST 'http://localhost:4000/api/online-tests' \
  -H 'Authorization: Bearer YOUR_JWT' \
  -H 'Content-Type: application/json' \
  -d '{"onlineTestTitle":"My test","totalCandidates":"100","totalSlots":"12","totalQuestionSet":"3","questionType":"written","startTime":"07:35","endTime":"14:35","duration":"234"}'
```

A successful create returns **201** with `{"id":"<uuid>"}`. **401** means missing/invalid/expired JWT. If you see **404** and HTML `Cannot POST /api/online-tests`, nothing on port 4000 is serving the current API (stop other processes, then from this folder run `npm run dev`).

Do not use curl’s **`-G`** with this body; that turns the request into a GET with a query string and will not create a test.
