# Architecture

## Overview

Monorepo with a React pipeline editor (frontend) and a FastAPI validation service (backend). State lives in Zustand; React Flow renders the graph.

```mermaid
flowchart TB
  Toolbar[PipelineToolbar]
  Canvas[PipelineUI / ReactFlow]
  Store[Zustand store]
  Submit[SubmitButton]
  API[FastAPI /pipelines/parse]

  Toolbar -->|drag drop| Canvas
  Canvas <--> Store
  Submit --> Store
  Submit --> API
```

## Frontend layers

### State (`store.js`)

- `nodes`, `edges` — graph controlled by React Flow
- `nodeIDs` — per-type counters for unique IDs
- `updateNodeField` — syncs node `data` from components
- `getNodeID(type)` — returns e.g. `llm-1`
- `localStorage` — Save / Load; Export / Import use JSON files

### Node abstraction (`nodes/`)

- **BaseNode** — shared shell: title, fields, static handles
- **nodeRegistry** — maps React Flow `type` → component + default data
- **nodeConfigs** — declarative field/handle definitions per node type
- **TextNode** — extends behavior: auto-resize, `{{var}}` regex handles

New nodes = add config + registry entry + toolbar item (no copy-paste).

**Demo node types (Part 1):** Filter, Merge, API, Delay, Note (plus original Input, Output, LLM, Text).

### Text node variables

Regex: `/\{\{\s*([a-zA-Z_$][\w$]*)\s*\}\}/g` in `utils/parseVariables.js`

Unique identifiers → target handles on the left (`{nodeId}-var-{name}`).

### Submit flow (Part 4)

1. Serialize `{ nodes, edges }` to JSON
2. `POST /pipelines/parse` with `FormData` field `pipeline`
3. On success: **`window.alert()`** with `num_nodes`, `num_edges`, `is_dag` (see `formatPipelineAlert` in `submit.js`)
4. On failure: centered error modal (backend down, invalid JSON, empty pipeline)

## Backend

### `POST /pipelines/parse`

- Accepts `pipeline` form field (JSON string)
- Validates JSON shape; rejects empty `nodes` with HTTP 400
- Counts nodes and edges
- **DAG check:** Kahn's algorithm (`collections.deque`). If visited count < node count → cycle exists

### CORS

`ALLOWED_ORIGINS` env (comma-separated) for Vercel + localhost.

## Tests

| Layer | Tool | Location |
|-------|------|----------|
| Backend unit | pytest | `backend/tests/` |
| Frontend unit | Jest | `frontend/src/**/*.test.js` |
| E2E | Playwright | `e2e/tests/` |

## Deployment split

| Service | Host | Role |
|---------|------|------|
| React static | Vercel | UI |
| FastAPI | Render | Graph validation API |

Frontend calls API via `REACT_APP_API_URL`.
