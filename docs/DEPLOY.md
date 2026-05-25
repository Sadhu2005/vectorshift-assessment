# Deployment Guide

## Frontend — Vercel (free)

1. Push repo to GitHub.
2. [vercel.com](https://vercel.com) → New Project → Import repository.
3. **Root Directory:** `frontend`
4. **Framework Preset:** Create React App
5. **Build Command:** `npm run build`
6. **Output Directory:** `build`
7. **Environment variables:**
   - `REACT_APP_API_URL` = your Render API URL (e.g. `https://vectorshift-api.onrender.com`)
   - Optional staging: `REACT_APP_ENV_LABEL` = `Staging`
8. **Git branch:**
   - `main` → Production
   - `staging` → Preview

## Backend — Render (free)

1. [render.com](https://render.com) → New → Web Service.
2. Connect GitHub repo.
3. **Root Directory:** `backend`
4. **Runtime:** Python 3
5. **Build:** `pip install -r requirements.txt`
6. **Start:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
7. **Environment:**
   - `ALLOWED_ORIGINS` = `https://your-app.vercel.app,http://localhost:3000`

Or use Blueprint: `backend/render.yaml`.

## Post-deploy checklist

- [ ] Open Vercel URL — editor loads
- [ ] Submit pipeline — modal shows counts (no CORS error)
- [ ] `is_dag: false` when you connect a cycle
- [ ] Update root `README.md` live URL table

## Local parity

```bash
# frontend/.env
REACT_APP_API_URL=http://localhost:8000
```
