# GitHub Actions & Vercel Setup

## CI pipeline overview

One workflow file: **`.github/workflows/ci.yml`** (runs on push to **`staging`** or **`main`** only).

```
1 · Backend tests ──────┐
1 · Frontend unit&lint ─┼── 2 · Build ──┼── 3 · E2E ── 4 · Deploy ── 5 · All passed
                        └───────────────┘
```

| Job | Required? | What it runs |
|-----|-------------|--------------|
| **Backend tests** | Yes | `pytest` (unit + API) |
| **Frontend unit tests** | Yes | Jest (`npm run test:ci`) |
| **Frontend lint** | Yes | ESLint (`npm run lint`) |
| **Frontend build** | Yes | `npm run build` + upload artifact |
| **E2E tests** | Yes | Playwright (uses build artifact) |
| **Deploy Vercel** | Optional* | Prebuilt deploy to Vercel |
| **All checks passed** | Gate | Fails if any required job failed |

\*Deploy runs by default. To skip deploy (no Vercel secrets yet), add GitHub variable `ENABLE_VERCEL_DEPLOY` = `false`.

`feature` branch pushes do **not** run CI.

---

## 1. GitHub repository variables (for CI builds)

These are **not** in Vercel. They go in your **GitHub repo** so the **Frontend build** job can call your Render API.

### Steps (GitHub)

1. Open your repo on **GitHub** (e.g. `vectorshift-assessment`).
2. **Settings** (repo settings, not your profile).
3. Left menu → **Secrets and variables** → **Actions**.
4. Use either tab — CI reads **both**:
   - **Secrets** (recommended for URLs) — **New repository secret**
   - **Variables** — **New repository variable**

| Name | Value | When CI uses it |
|------|--------|-----------------|
| `REACT_APP_API_URL_PRODUCTION` | `https://vectorshift-assessment-j2i4.onrender.com` | Push to **`main`** |
| `REACT_APP_API_URL_STAGING` | Same Render URL | Push to **`staging`** |
| `REACT_APP_API_URL` *(optional)* | Fallback | Any branch |

**Example** (no quotes, no trailing slash):

```
REACT_APP_API_URL_PRODUCTION = https://vectorshift-assessment-j2i4.onrender.com
REACT_APP_API_URL_STAGING    = https://vectorshift-assessment-j2i4.onrender.com
```

> If you already added these under **Secrets** (as in your screenshot), that is correct — push the latest `ci.yml` so CI uses `secrets.*` as well as `vars.*`.

> **Vercel “Sensitive”** on `REACT_APP_API_URL`: `vercel pull` may **not** export sensitive values. CI relies on GitHub Secrets/Variables for the build URL.

Other GitHub **Secrets**: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` (see section 2).

---

## 1b. Vercel environment variables (for deployed app **vecter**)

When Vercel deploys (Git integration or GitHub Action), the **live site** needs the same API URL. That is configured in **Vercel**, not in GitHub Variables.

### Steps (Vercel — project **vecter**)

1. [vercel.com](https://vercel.com) → project **vecter**.
2. Top tabs → **Settings** (not “Deployments”).
3. Left sidebar → **Environment Variables** (below “Environments” — different page).
4. Add:

| Key | Value | Environments |
|-----|--------|----------------|
| `REACT_APP_API_URL` | `https://vectorshift-assessment-j2i4.onrender.com` | **Production** + **Preview** |

Prefer **not** marking this as Sensitive if you want `vercel pull` in CI to see it; GitHub Secrets are enough for CI builds.

5. Save, then trigger a **new** deployment (see below).

> **Important:** React bakes `REACT_APP_API_URL` at **build time**. If Submit shows `localhost:8000`, the URL was missing when the app was built.

> **Prebuilt deploys (CI):** Do **not** use Vercel **Deployments → Redeploy** on a prebuilt deployment — Vercel will warn that env vars are not applied. Instead: **GitHub Actions → CI → Re-run all jobs**, or **Run workflow** (manual), or push to `staging`/`main`.

Your **Environments** page shows:

| Vercel environment | Git branch | Your URL |
|------------------|------------|----------|
| **Production** | `main` | `vecter.vercel.app` |
| **Preview** | other branches (e.g. `staging`) | `*.vercel.app` preview URLs |

Use the **same** `REACT_APP_API_URL` for both unless you have two different Render services.

### Optional preview label (staging)

| Key | Value | Environments |
|-----|--------|----------------|
| `REACT_APP_ENV_LABEL` | `Staging` | **Preview** only |

Shows a banner on preview deploys (see `App.js`).

---
## 2. Vercel secrets (Settings → Secrets and variables → Actions → Secrets)

Get these from [vercel.com/account/tokens](https://vercel.com/account/tokens) and your project settings:

| Secret | Where to find |
|--------|----------------|
| `VERCEL_TOKEN` | Vercel → Account → Tokens → Create |
| `VERCEL_ORG_ID` | Project → Settings → General → Team/Org ID |
| `VERCEL_PROJECT_ID` | Project → Settings → General → Project ID |

Or run locally in `frontend/` after `npx vercel link`:

```bash
cat .vercel/project.json
```

Add all three secrets to GitHub. After that, **Deploy Vercel** runs automatically after E2E passes.

CI reuses the CRA `build/` artifact, packs it into `.vercel/output` (required by `vercel deploy --prebuilt`), then deploys.

### Vercel project settings (one-time)

1. Import repo on Vercel (or link via CLI).
2. **Root Directory:** `frontend`
3. **Framework:** Create React App
4. **Build Command:** `npm run build` (GitHub Action uses prebuilt artifact; Vercel UI settings still apply for manual deploys)
5. **Output Directory:** `build`
6. In Vercel → **Settings** → **Environment Variables**, set `REACT_APP_API_URL` (see **§1b** above).

### Alternative: Vercel Git integration only

You can skip GitHub deploy and let Vercel deploy on push by connecting the repo in the Vercel dashboard. In that case, CI still runs tests; disable duplicate deploys by leaving `VERCEL_TOKEN` unset in GitHub.

---

## 3. Branch protection

**Settings → Branches → Add rule**

| Branch | Required status check |
|--------|------------------------|
| `staging` | **All checks passed** (workflow: CI) |
| `main` | **All checks passed** (workflow: CI) |

---

## 4. Deploy backend on Render (required for Submit)

The frontend on Vercel cannot use `localhost:8000`. Deploy the API first:

1. [render.com](https://render.com) → **New +** → **Web Service** → connect your GitHub repo.
2. **Root Directory:** `backend`
3. **Build:** `pip install -r requirements.txt`
4. **Start:** `python -m uvicorn main:app --host 0.0.0.0 --port $PORT`
5. **Environment variable:**

| Key | Value |
|-----|--------|
| `ALLOWED_ORIGINS` | `https://vecter.vercel.app,https://*.vercel.app,http://localhost:3000` |

6. Deploy and copy your service URL, e.g. `https://vectorshift-pipeline-api.onrender.com`
7. Paste that URL into **Vercel** `REACT_APP_API_URL` (section 1b) and GitHub variables (section 1).
8. Push to `staging` or `main` so CI rebuilds and redeploys Vercel.

Test API: open `https://YOUR-RENDER-URL/` → should show `{"Ping":"Pong"}`.

## 5. Render backend (CORS)

On Render, set:

```
ALLOWED_ORIGINS=https://vecter.vercel.app,https://*.vercel.app,http://localhost:3000
```

Use your real production domain and preview pattern from Vercel.

---

## 6. Local commands (match CI)

```bash
# Backend unit tests
cd backend && pip install -r requirements.txt -r requirements-dev.txt && python -m pytest -v

# Frontend unit + lint + build
cd frontend && npm ci && npm run test:ci && npm run lint && npm run build
```
