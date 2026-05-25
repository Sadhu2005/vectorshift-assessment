# Pipeline Editor

Visual workflow builder with React Flow and FastAPI. Design node pipelines on a canvas, save or import graphs, and validate structure (node count, edge count, DAG) via the backend.

## Repository structure

```
├── frontend/     # React + React Flow + Zustand + Tailwind
├── backend/      # FastAPI — pipeline parse & DAG validation
├── docs/         # Architecture, deploy guide, sample JSON
└── README.md
```

## Branch strategy

| Branch | Purpose |
|--------|---------|
| `feature` | Development |
| `staging` | Integration / preview |
| `main` | Production |

## Local development

### Frontend

```bash
cd frontend
npm install
npm start
```

http://localhost:3000

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

http://localhost:8000

### Environment

Create `frontend/.env`:

```
REACT_APP_API_URL=http://localhost:8000
```

## Features

- Config-driven node abstraction + demo node types
- Pipeline templates, Save / Load / Export / Import
- Text node with `{{variable}}` handles and auto-resize
- `POST /pipelines/parse` → `{ num_nodes, num_edges, is_dag }`

## Deployment

**Frontend (Vercel):** root `frontend`, build `npm run build`, env `REACT_APP_API_URL`

**Backend (Render):** root `backend`, start `uvicorn main:app --host 0.0.0.0 --port $PORT`, env `ALLOWED_ORIGINS`

Details: [docs/DEPLOY.md](docs/DEPLOY.md)

## Test Import

1. **Import** in the header
2. Select [docs/examples/sample-pipeline-import.json](docs/examples/sample-pipeline-import.json)
3. Expect 4 nodes: Input → Text → LLM → Output

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Deploy guide](docs/DEPLOY.md)
