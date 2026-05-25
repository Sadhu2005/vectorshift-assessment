# Frontend — Pipeline Editor

React app for the VectorShift assessment. See the [root README](../README.md) for setup, tests, CI, and deployment.

## Quick start

```bash
npm install
cp .env.example .env
npm start
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Dev server (http://localhost:3000) |
| `npm run build` | Production build |
| `npm test` | Jest (watch mode) |
| `npm run test:ci` | Jest once (CI / pre-push) |

## Key paths

| Path | Role |
|------|------|
| `src/nodes/` | BaseNode abstraction, configs, Text node |
| `src/submit.js` | Submit → API → `window.alert()` |
| `src/store.js` | Zustand + save/load/import/export |
