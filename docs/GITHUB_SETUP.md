# GitHub Actions & Vercel Setup

## CI pipeline overview

On push to **`staging`** or **`main`** only:

```
Backend tests ──────────────┐
Frontend unit tests ──┐     │
Frontend lint ────────┼── Frontend build ──┼── E2E ── Deploy Vercel ── All checks passed
                      └─────┘                │
Backend tests ───────────────────────────────┘
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

\*Deploy runs only when Vercel secrets are configured. Tests still run without them.

`feature` branch pushes do **not** run CI.

---

## 1. GitHub repository variables (for CI builds)

These are **not** in Vercel. They go in your **GitHub repo** so the **Frontend build** job can call your Render API.

### Steps (GitHub)

1. Open your repo on **GitHub** (e.g. `vectorshift-assessment`).
2. **Settings** (repo settings, not your profile).
3. Left menu → **Secrets and variables** → **Actions**.
4. Open the **Variables** tab (next to Secrets).
5. Click **New repository variable** for each row below.

| Variable name | Value (your Render backend URL) | When CI uses it |
|---------------|----------------------------------|-----------------|
| `REACT_APP_API_URL_PRODUCTION` | `https://your-api.onrender.com` | Push to **`main`** |
| `REACT_APP_API_URL_STAGING` | Same URL, or a separate staging API | Push to **`staging`** |
| `REACT_APP_API_URL` *(optional)* | Fallback if the above are missing | Any branch |

**Example** (replace with your real Render URL):

```
REACT_APP_API_URL_PRODUCTION = https://vectorshift-pipeline-api.onrender.com
REACT_APP_API_URL_STAGING    = https://vectorshift-pipeline-api.onrender.com
```

No quotes in the GitHub UI — paste the URL only.

> **Note:** GitHub **Variables** = build-time API URL for Actions.  
> GitHub **Secrets** = `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` (see section 2).

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
| `REACT_APP_API_URL` | `https://your-api.onrender.com` | **Production** + **Preview** |

5. Save. **Redeploy** if the app was already deployed (Deployments → … → Redeploy).

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
| `staging` | **All checks passed** (workflow: CI Staging) |
| `main` | **All checks passed** (workflow: CI Main) |

---

## 4. Render backend (CORS)

On Render, set:

```
ALLOWED_ORIGINS=https://vecter.vercel.app,https://*.vercel.app,http://localhost:3000
```

Use your real production domain and preview pattern from Vercel.

---

## 5. Local commands (match CI)

```bash
# Backend unit tests
cd backend && pip install -r requirements.txt -r requirements-dev.txt && python -m pytest -v

# Frontend unit + lint + build
cd frontend && npm ci && npm run test:ci && npm run lint && npm run build
```
