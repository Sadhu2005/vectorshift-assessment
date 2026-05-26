import json

import pytest
from fastapi.testclient import TestClient

from main import app, is_dag, parse_cors_config

client = TestClient(app)


class TestIsDag:
    def test_linear_chain_is_dag(self):
        nodes = ["A", "B", "C"]
        edges = [
            {"source": "A", "target": "B"},
            {"source": "B", "target": "C"},
        ]
        assert is_dag(nodes, edges) is True

    def test_cycle_is_not_dag(self):
        nodes = ["A", "B", "C"]
        edges = [
            {"source": "A", "target": "B"},
            {"source": "B", "target": "C"},
            {"source": "C", "target": "A"},
        ]
        assert is_dag(nodes, edges) is False

    def test_self_loop_is_not_dag(self):
        assert is_dag(["A"], [{"source": "A", "target": "A"}]) is False

    def test_empty_nodes_is_dag(self):
        assert is_dag([], []) is True

    def test_disconnected_nodes_is_dag(self):
        assert is_dag(["A", "B"], []) is True

    def test_parallel_fork_merge_is_dag(self):
        nodes = ["in", "a", "b", "out"]
        edges = [
            {"source": "in", "target": "a"},
            {"source": "in", "target": "b"},
            {"source": "a", "target": "out"},
            {"source": "b", "target": "out"},
        ]
        assert is_dag(nodes, edges) is True

    def test_dangling_edge_target_ignored(self):
        assert is_dag(["A"], [{"source": "A", "target": "ghost"}]) is True


class TestCorsConfig:
    def test_wildcard_becomes_regex(self):
        origins, regex = parse_cors_config(
            "http://localhost:3000,https://*.vercel.app"
        )
        assert origins == ["http://localhost:3000"]
        assert regex == r"^https://.*\.vercel\.app$"

    def test_cors_preflight_allows_vercel_preview(self):
        response = client.options(
            "/pipelines/parse",
            headers={
                "Origin": "https://vecter-gzcanju4l-sadhu2005s-projects.vercel.app",
                "Access-Control-Request-Method": "POST",
            },
        )
        assert response.status_code == 200
        assert (
            response.headers.get("access-control-allow-origin")
            == "https://vecter-gzcanju4l-sadhu2005s-projects.vercel.app"
        )


class TestHealth:
    def test_root_ping(self):
        response = client.get("/")
        assert response.status_code == 200
        assert response.json() == {"Ping": "Pong"}


class TestParsePipeline:
    def _post(self, nodes, edges):
        payload = json.dumps({"nodes": nodes, "edges": edges})
        return client.post(
            "/pipelines/parse",
            data={"pipeline": payload},
        )

    def test_valid_linear_dag(self):
        response = self._post(
            [{"id": "A"}, {"id": "B"}, {"id": "C"}],
            [{"source": "A", "target": "B"}, {"source": "B", "target": "C"}],
        )
        assert response.status_code == 200
        data = response.json()
        assert data == {"num_nodes": 3, "num_edges": 2, "is_dag": True}

    def test_cycle_returns_not_dag(self):
        response = self._post(
            [{"id": "A"}, {"id": "B"}, {"id": "C"}],
            [
                {"source": "A", "target": "B"},
                {"source": "B", "target": "C"},
                {"source": "C", "target": "A"},
            ],
        )
        assert response.status_code == 200
        assert response.json()["is_dag"] is False

    def test_empty_pipeline_rejected(self):
        response = self._post([], [])
        assert response.status_code == 400
        assert "at least one node" in response.json()["detail"].lower()

    def test_invalid_json_rejected(self):
        response = client.post(
            "/pipelines/parse",
            data={"pipeline": "not-json"},
        )
        assert response.status_code == 400
        assert "invalid" in response.json()["detail"].lower()

    def test_non_object_pipeline_rejected(self):
        response = client.post(
            "/pipelines/parse",
            data={"pipeline": json.dumps([1, 2, 3])},
        )
        assert response.status_code == 400

    def test_invalid_nodes_type_rejected(self):
        response = client.post(
            "/pipelines/parse",
            data={"pipeline": json.dumps({"nodes": "bad", "edges": []})},
        )
        assert response.status_code == 400
