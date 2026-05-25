# Pipeline Editor

VectorShift-style workflow builder: design node pipelines on a canvas, save or import graphs, and validate structure (node count, edge count, DAG) via FastAPI.

## Repository structure

```
├── frontend/          # React + React Flow + Zustand + Tailwind
├── backend/           # FastAPI — pipeline parse & DAG validation
├── e2e/               # Playwright API + UI tests
├── docs/              # Architecture, deploy guide, sample JSON
└── .github/workflows/ # ci.yml (staging + main)
```

## Assessment coverage (VectorShift brief)

| Part | Requirement | Implementation |
|------|-------------|----------------|
| **1** | Node abstraction + 5 new nodes | `BaseNode`, `nodeConfigs.js`, `createNodeComponent.js`; new nodes: Filter, Merge, API, Delay, Note |
| **2** | Unified styling | Tailwind layout, header, sidebar, colored nodes |
| **3** | Text auto-resize + `{{variable}}` handles | `textNode.js`, `utils/parseVariables.js` |
| **4** | Submit → `/pipelines/parse` → **alert** with counts + DAG | `submit.js` → `window.alert()`, `backend/main.py` (Kahn's algorithm) |

## Branch strategy

| Branch | Purpose |
|--------|---------|
| `feature` | Development — **no CI**; test locally before merge |
| `staging` | Preview — **CI** runs on push (Vercel preview) |
| `main` | Production — **CI** runs on push (Vercel production) |

Merge flow: `feature` → `staging` → `main`. One workflow: `.github/workflows/ci.yml`.

## Local development

### Prerequisites

- Node.js 20+
- Python 3.9+ (3.11 recommended for CI parity)

### Frontend

```bash
cd frontend
npm install
cp .env.example .env   # or create .env manually
npm start
```

Open http://localhost:3000

### Backend

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

Open http://localhost:8000

On Windows, use `python -m uvicorn` if the `uvicorn` command is not on PATH.

### Environment (`frontend/.env`)

```
REACT_APP_API_URL=http://localhost:8000
```

Optional: `REACT_APP_ENV_LABEL=Staging` for a banner in preview builds.

## Tech stack

| Layer | Stack |
|-------|--------|
| Frontend | React 18, React Flow, Zustand, Tailwind CSS |
| Backend | FastAPI, Pydantic, Uvicorn |
| Validation | Kahn's algorithm (topological sort) for DAG detection |
| Tests | pytest, Jest, Playwright |

## Features

- Config-driven node abstraction (Input, Output, LLM, Text + 5 demo types)
- Pipeline templates, Save / Load / Export / Import
- Text node: `{{variable}}` dynamic handles and auto-resize
- Submit: `POST /pipelines/parse` → `window.alert` with `num_nodes`, `num_edges`, `is_dag`

## Tests (before merge to staging/main)

```bash
# Backend
cd backend
pip install -r requirements.txt -r requirements-dev.txt
python -m pytest -v

# Frontend unit
cd frontend
npm run test:ci

# E2E (build frontend first)
cd frontend && npm run build
cd ../e2e && npm ci && npx playwright install chromium
npm test
```

## CI (GitHub Actions)

Single workflow **`ci.yml`** on push to `staging` or `main`.

| Branch | Vercel | Status check |
|--------|--------|--------------|
| `staging` | Preview | **All checks passed** |
| `main` | Production (`--prod`) | **All checks passed** |

Setup: **[docs/GITHUB_SETUP.md](docs/GITHUB_SETUP.md)**

## Deployment

| App | Host | Root | Notes |
|-----|------|------|-------|
| Frontend | Vercel | `frontend` | `REACT_APP_API_URL` → Render API URL |
| Backend | Render | `backend` | `ALLOWED_ORIGINS` → Vercel URL + localhost |

Details: [docs/DEPLOY.md](docs/DEPLOY.md)

## Quick demo (import)

1. Click **Import** in the header
2. Select [docs/examples/sample-pipeline-import.json](docs/examples/sample-pipeline-import.json)
3. Expect 4 nodes: Input → Text → LLM → Output
4. Click **Submit** — browser alert shows node/edge counts and DAG status

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Deploy guide](docs/DEPLOY.md)
- [GitHub CI & Vercel setup](docs/GITHUB_SETUP.md)
