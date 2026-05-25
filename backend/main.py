import json
import os
from typing import List

from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="VectorShift Pipeline API")

default_origins = "http://localhost:3000,http://127.0.0.1:3000"
allowed_origins = os.getenv("ALLOWED_ORIGINS", default_origins).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in allowed_origins if o.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ParseResponse(BaseModel):
    num_nodes: int
    num_edges: int
    is_dag: bool


def is_dag(node_ids: List[str], edges: list) -> bool:
    """Kahn's algorithm — returns True if graph is a DAG."""
    if not node_ids:
        return True

    node_set = set(node_ids)
    in_degree = {n: 0 for n in node_set}
    adj = {n: [] for n in node_set}

    for edge in edges:
        src = edge.get("source")
        tgt = edge.get("target")
        if src not in node_set or tgt not in node_set:
            continue
        adj[src].append(tgt)
        in_degree[tgt] = in_degree.get(tgt, 0) + 1

    queue = [n for n in node_set if in_degree[n] == 0]
    visited = 0

    while queue:
        node = queue.pop(0)
        visited += 1
        for neighbor in adj[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    return visited == len(node_set)


@app.get("/")
def read_root():
    return {"Ping": "Pong"}


@app.post("/pipelines/parse", response_model=ParseResponse)
def parse_pipeline(pipeline: str = Form(...)):
    data = json.loads(pipeline)
    nodes = data.get("nodes", [])
    edges = data.get("edges", [])

    node_ids = [n.get("id") for n in nodes if n.get("id")]
    num_nodes = len(nodes)
    num_edges = len(edges)
    dag = is_dag(node_ids, edges)

    return ParseResponse(
        num_nodes=num_nodes,
        num_edges=num_edges,
        is_dag=dag,
    )
