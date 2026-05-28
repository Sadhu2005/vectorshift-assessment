import json
import os
import re
from collections import deque
from typing import Dict, List, Optional, Tuple

from fastapi import FastAPI, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="VectorShift Pipeline API")

default_origins = (
    "http://localhost:3000,"
    "http://127.0.0.1:3000,"
    "https://*.vercel.app"
)


def parse_cors_config(raw: str) -> Tuple[List[str], Optional[str]]:
    """Split ALLOWED_ORIGINS into exact origins and regex patterns (* wildcards)."""
    origins: List[str] = []
    patterns: List[str] = []
    for item in raw.split(","):
        item = item.strip()
        if not item:
            continue
        if "*" in item:
            patterns.append("^" + re.escape(item).replace(r"\*", ".*") + "$")
        else:
            origins.append(item)
    origin_regex = "|".join(patterns) if patterns else None
    return origins, origin_regex


allowed_raw = os.getenv("ALLOWED_ORIGINS", default_origins)
cors_origins, cors_origin_regex = parse_cors_config(allowed_raw)

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_origin_regex=cors_origin_regex,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ParseResponse(BaseModel):
    num_nodes: int
    num_edges: int
    is_dag: bool
    isolated_nodes: List[str] = []
    missing_required_inputs: Dict[str, List[str]] = {}


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

    queue = deque(n for n in node_set if in_degree[n] == 0)
    visited = 0

    while queue:
        node = queue.popleft()
        visited += 1
        for neighbor in adj[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    return visited == len(node_set)


def required_target_handles_for_node(node: dict) -> List[str]:
    """
    Return list of required targetHandle IDs for a node (React Flow handle IDs).

    We keep this conservative and aligned to the editor's handle naming scheme:
    - Static handles are `${nodeId}-${idSuffix}` (see BaseNode)
    - Text node variable handles are `${nodeId}-var-${name}` (see TextNode)
    """
    node_id = node.get("id")
    node_type = node.get("type") or node.get("data", {}).get("nodeType")
    data = node.get("data") or {}
    if not node_id or not node_type:
        return []

    # Utility node: no connections required.
    if node_type == "note":
        return []

    # Nodes with one required input.
    if node_type in {"customOutput", "filter", "api", "delay"}:
        return [f"{node_id}-value"] if node_type == "customOutput" else [f"{node_id}-in"]

    # Nodes with two required inputs.
    if node_type == "merge":
        return [f"{node_id}-a", f"{node_id}-b"]

    # LLM expects both system + prompt inputs.
    if node_type == "llm":
        return [f"{node_id}-system", f"{node_id}-prompt"]

    # Text variables (if any) are required inputs.
    if node_type == "text":
        variables = data.get("variables") or []
        if not isinstance(variables, list):
            variables = []
        return [f"{node_id}-var-{name}" for name in variables if isinstance(name, str) and name]

    # Default: don't enforce required inputs for unknown node types.
    return []


def compute_isolated_nodes(node_ids: List[str], edges: list, ignorable: set) -> List[str]:
    degrees = {nid: 0 for nid in node_ids}
    node_set = set(node_ids)
    for e in edges:
        src = e.get("source")
        tgt = e.get("target")
        if src in node_set:
            degrees[src] += 1
        if tgt in node_set:
            degrees[tgt] += 1
    isolated = [nid for nid, deg in degrees.items() if deg == 0 and nid not in ignorable]
    isolated.sort()
    return isolated


def compute_missing_required_inputs(nodes: list, edges: list) -> Dict[str, List[str]]:
    # Index edges by targetHandle for quick lookup
    connected_target_handles = set()
    for e in edges:
        th = e.get("targetHandle")
        if isinstance(th, str) and th:
            connected_target_handles.add(th)

    missing: Dict[str, List[str]] = {}
    for n in nodes:
        node_id = n.get("id")
        if not node_id:
            continue
        required = required_target_handles_for_node(n)
        if not required:
            continue
        node_missing = [h for h in required if h not in connected_target_handles]
        if node_missing:
            missing[node_id] = node_missing
    return missing


@app.get("/")
def read_root():
    return {"Ping": "Pong"}


@app.post("/pipelines/parse", response_model=ParseResponse)
def parse_pipeline(pipeline: str = Form(...)):
    try:
        data = json.loads(pipeline)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid pipeline JSON")

    if not isinstance(data, dict):
        raise HTTPException(status_code=400, detail="Pipeline must be a JSON object")

    nodes = data.get("nodes", [])
    edges = data.get("edges", [])

    if not isinstance(nodes, list) or not isinstance(edges, list):
        raise HTTPException(status_code=400, detail="nodes and edges must be arrays")

    if len(nodes) == 0:
        raise HTTPException(status_code=400, detail="Pipeline must contain at least one node")

    node_ids = [n.get("id") for n in nodes if n.get("id")]
    num_nodes = len(nodes)
    num_edges = len(edges)
    dag = is_dag(node_ids, edges)

    return ParseResponse(
        num_nodes=num_nodes,
        num_edges=num_edges,
        is_dag=dag,
        isolated_nodes=compute_isolated_nodes(
            node_ids,
            edges,
            ignorable=set(
                n.get("id")
                for n in nodes
                if (n.get("type") or n.get("data", {}).get("nodeType")) == "note"
                and n.get("id")
            ),
        ),
        missing_required_inputs=compute_missing_required_inputs(nodes, edges),
    )
