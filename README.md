# VectorShift Frontend Assessment

A visual pipeline editor built with React Flow and FastAPI. Drag nodes onto the canvas, connect them, and validate the graph (node/edge counts and DAG check) via the backend API.

## Repository structure

```
├── frontend/     # React (CRA) + React Flow + Zustand + Tailwind
├── backend/      # FastAPI — pipeline parse & DAG validation
├── docs/         # Architecture & interview notes
└── README.md
```

## Branch strategy

| Branch | Purpose |
|--------|---------|
| `feature` | Active development |
| `staging` | Integration & preview deploy |
| `main` | Submission-ready production |

## Local development

### Frontend

```bash
cd frontend
npm install
npm start
```

Runs at [http://localhost:3000](http://localhost:3000).

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

API at [http://localhost:8000](http://localhost:8000).

### Environment

Create `frontend/.env`:

```
REACT_APP_API_URL=http://localhost:8000
```

## Assessment features

1. **Node abstraction** — Config-driven `BaseNode` + 5 demo nodes
2. **Styling** — Tailwind, VectorShift-inspired UI
3. **Text node** — Auto-resize + `{{variable}}` dynamic handles
4. **Backend** — `POST /pipelines/parse` → `{ num_nodes, num_edges, is_dag }`

## Deployment

### Frontend (Vercel)

- Root directory: `frontend`
- Build: `npm run build`
- Output: `build`
- Env: `REACT_APP_API_URL=<your-render-api-url>`

### Backend (Render)

- Root directory: `backend`
- Build: `pip install -r requirements.txt`
- Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Env: `ALLOWED_ORIGINS=https://your-app.vercel.app,http://localhost:3000`

See [docs/DEPLOY.md](docs/DEPLOY.md) for step-by-step setup.

## Live URLs

| Environment | Frontend | Backend |
|-------------|----------|---------|
| Production (`main`) | _Set after Vercel deploy_ | _Set after Render deploy_ |
| Staging | _Vercel preview branch_ | _Same or staging API_ |

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Deploy guide](docs/DEPLOY.md)
- [Interview script](docs/INTERVIEW_SCRIPT.md)
