# Screen Recording Script (~5–8 min)

Use this outline when recording your submission demo from the `main` branch (production URL optional).

## 1. Introduction (30s)

- Project name and stack: React Flow + Zustand + Tailwind, FastAPI backend
- Branch workflow: feature → staging → main

## 2. Architecture (1 min)

- Open `docs/ARCHITECTURE.md` or explain verbally:
  - **BaseNode** — config-driven nodes, no copy-paste
  - **Zustand** — single source of truth for graph state
  - **Text node** — regex `{{var}}` → dynamic left handles
  - **Backend** — POST parse, Kahn's algorithm for DAG

## 3. Node abstraction demo (1 min)

- Drag Input, LLM, Output from categorized toolbar
- Drag demo nodes: Filter, Merge, API, Delay, Note
- Mention: adding a node = config + registry entry

## 4. Text node (1 min)

- Add Text node, type: `Hello {{name}}, your score is {{score}}`
- Show left handles appearing for `name` and `score`
- Show textarea growing as you type

## 5. Styling (30s)

- Dark toolbar, card nodes, indigo accent — intentional VectorShift-adjacent UX

## 6. Save / Load (30s)

- Build small pipeline → Save → Clear → Load → graph restored

## 7. Submit & DAG (1.5 min)

- Linear pipeline: Input → Text → LLM → Output → Submit → **Valid DAG: Yes**
- Add edge creating a cycle → Submit → **Valid DAG: No**
- Explain backend counts nodes/edges and topological sort

## 8. Deployment (30s)

- Show Vercel frontend URL + Render API (if deployed)
- Mention CORS and `REACT_APP_API_URL`

## Closing

- You understand tradeoffs: static frontend on Vercel, API on Render, why not one host for Python
