# VectorShift Assessment — Recording Script (5–8 minutes)

Keep it calm, confident, engineering-focused. Don’t read like a robot—use this as a guide.

## Setup (before you hit record)

- Close extra tabs and notifications
- Have **deployed app** open (Vercel)
- Have **Render backend** tab open (shows `{"Ping":"Pong"}`)
- Open these code files in the editor:
  - `frontend/src/nodes/BaseNode.js`
  - `frontend/src/nodes/nodeConfigs.js`
  - `frontend/src/nodes/createNodeComponent.js`
  - `frontend/src/nodes/nodeRegistry.js`
  - `frontend/src/nodes/textNode.js`
  - `frontend/src/utils/parseVariables.js`
  - `backend/main.py`

---

## 1) Intro (20–30s)

“Hi, I’m Sadhu. This is my submission for the VectorShift frontend technical assessment.

It’s a workflow/pipeline editor built with React and ReactFlow, and a FastAPI backend that validates pipelines and checks whether the graph is a DAG.”

---

## 2) Product overview (45–60s) — show the UI first

“The app lets users build automation-style pipelines by dragging nodes onto the canvas and connecting them visually.

I aimed for a product-like experience: templates for onboarding, persistence features like save/load, and a clean submit flow that returns pipeline stats.”

Do on screen:
- Open **Templates**
- Slowly pan/zoom canvas
- Point out header actions (Save/Load/Clear/Submit)

---

## 3) Architecture (1.5–2 min) — strongest section

Open these files:
- `BaseNode.js`
- `nodeConfigs.js`
- `createNodeComponent.js`
- `nodeRegistry.js`

Say:
“A key goal here was scalability and reducing repeated node code.

Instead of implementing every node independently, I built a reusable `BaseNode` and a config-driven node architecture.
Each node type is described by configuration in `nodeConfigs`, and `createNodeComponent` generates the actual React component.

This makes it easy to add new node types consistently—usually by adding a config entry instead of duplicating layout, handles, and styling logic.”

---

## 4) Dynamic variable parsing (45–60s) — impressive demo

Open:
- `textNode.js`
- `parseVariables.js`

Do on screen:
- Add a Text node
- Type:
  - `{{input}}`
  - `{{query}}`
  - `{{email}}`
- Show input handles appear
- Delete one variable and show handle disappears

Say:
“For the Text node, I implemented dynamic variable parsing with a small regex-based utility.
When users type `{{variable}}` patterns, the editor detects them and generates input handles automatically.

This matches how real workflow tools behave—inputs are derived directly from the template text.”

---

## 5) Templates + UX (30–45s)

Do on screen:
- Click a template
- Preview
- “Use this template”

Say:
“I added workflow templates and categories to improve onboarding.
The goal is to make the editor feel usable immediately instead of starting from a blank canvas.”

---

## 6) Save/Load + Import/Export (30–45s)

Do on screen:
- Save
- Clear
- Load
- Export / Import (quickly)

Say:
“I implemented pipeline persistence so work can be saved locally in the browser, and moved across devices using import/export.”

---

## 7) Backend + DAG validation (60–90s)

Open:
- `backend/main.py`

Say:
“On submit, the frontend sends the nodes and edges to the FastAPI backend.
The backend validates the structure and computes:
- number of nodes
- number of edges
- whether the graph is a DAG (cycle-free)

For DAG validation I used Kahn’s algorithm to detect cycles.”

Do on screen:
- Submit a valid pipeline → show **success `window.alert()`** with stats
- Create a cycle and submit again → show the non-DAG result

---

## 8) Local + deployed (45–60s) — “proof it runs”

Say:
“This runs both locally and deployed.
In production the frontend points to the Render backend via `REACT_APP_API_URL`, and locally it points to localhost.”

Show commands quickly (don’t linger):

Backend (local):
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

Frontend (local):
```bash
cd frontend
# .env: REACT_APP_API_URL=http://localhost:8000
npm install
npm start
```

---

## 9) Tests + engineering practices (25–40s)

Show directories:
- `backend/tests/`
- `e2e/`
- `.github/workflows/`
- `docs/`

Say:
“I added backend unit tests, frontend utility tests, Playwright E2E tests, and a CI workflow so builds are reproducible and maintainable.”

---

## 10) Close (15–20s)

“Overall, my focus was building a scalable node architecture and a product-oriented workflow editor, not just the minimum requirements.

Thanks for reviewing my submission.”

---

## Optional (10–15s) — mobile UX line

“On phones, I added a landscape-first experience because node editing is difficult in portrait. In portrait it prompts rotation, and in landscape you can optionally enter fullscreen.”

