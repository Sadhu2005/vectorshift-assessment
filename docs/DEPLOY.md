# Deployment Guide

## Frontend — Vercel

1. Push repo to GitHub.
2. [vercel.com](https://vercel.com) → New Project → Import repository.
3. **Root Directory:** `frontend`
4. **Framework Preset:** Create React App
5. **Build Command:** `npm run build`
6. **Output Directory:** `build`
7. **Environment variables:**
   - `REACT_APP_API_URL` = your Render API URL (e.g. `https://your-api.onrender.com`)
   - Optional: `REACT_APP_ENV_LABEL` = `Staging` (preview banner)
8. **Git branch:**
   - `main` → Production
   - `staging` → Preview

## Fix “Failed to fetch” / `localhost:8000` on Vercel

1. Deploy backend on Render (below) and get the API URL.
2. Vercel → **vecter** → **Settings** → **Environment Variables** → add `REACT_APP_API_URL` = `https://YOUR-RENDER-URL.onrender.com` (Production + Preview).
3. GitHub → **Variables** → `REACT_APP_API_URL_STAGING` and/or `REACT_APP_API_URL_PRODUCTION` = same URL.
4. Push to `staging` or `main` to trigger CI (rebuilds with correct URL).

## Backend — Render

1. [render.com](https://render.com) → New → Web Service.
2. Connect GitHub repo.
3. **Root Directory:** `backend`
4. **Runtime:** Python 3.11
5. **Build:** `pip install -r requirements.txt`
6. **Start:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
7. **Environment:**
   - `ALLOWED_ORIGINS` = `https://your-app.vercel.app,http://localhost:3000`

Or deploy via Blueprint: `backend/render.yaml`.

## CI gate (before deploy)

CI runs **only on push to `staging` or `main`**:

| Workflow | Trigger |
|----------|---------|
| `ci.yml` | push to `staging` or `main` |

CI runs unit tests, lint, build, E2E, then deploys to Vercel when secrets are set.

Full GitHub + Vercel configuration: **[GITHUB_SETUP.md](GITHUB_SETUP.md)**

`feature` pushes do not run CI. Test locally:

```bash
cd backend && pip install -r requirements.txt -r requirements-dev.txt && python -m pytest -v
cd ../frontend && npm ci && npm run test:ci && npm run lint && npm run build
```

## Post-deploy checklist

- [ ] Vercel URL loads the editor
- [ ] `REACT_APP_API_URL` points to the live Render API
- [ ] Submit shows a **browser alert** with node count, edge count, and DAG status (no CORS error)
- [ ] Cycle in the graph → alert shows DAG **No**
- [ ] Add live URLs to README if required by submission

## Local parity

```bash
# frontend/.env
REACT_APP_API_URL=http://localhost:8000
```

```bash
# terminal 1
cd backend && python -m uvicorn main:app --reload

# terminal 2
cd frontend && npm start
```
