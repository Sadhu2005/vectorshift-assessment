import { test, expect, type APIRequestContext } from '@playwright/test';

const API = 'http://127.0.0.1:8000';

async function parsePipeline(
  request: APIRequestContext,
  nodes: object[],
  edges: object[]
) {
  const pipeline = JSON.stringify({ nodes, edges });
  return request.post(`${API}/pipelines/parse`, {
    form: { pipeline },
  });
}

test.describe('Pipeline API', () => {
  test('health check', async ({ request }) => {
    const res = await request.get(`${API}/`);
    expect(res.ok()).toBeTruthy();
    expect(await res.json()).toEqual({ Ping: 'Pong' });
  });

  test('linear DAG returns is_dag true', async ({ request }) => {
    const res = await parsePipeline(
      request,
      [{ id: 'A' }, { id: 'B' }, { id: 'C' }],
      [
        { source: 'A', target: 'B' },
        { source: 'B', target: 'C' },
      ]
    );
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.is_dag).toBe(true);
    expect(body.num_nodes).toBe(3);
    expect(body.num_edges).toBe(2);
  });

  test('cycle returns is_dag false', async ({ request }) => {
    const res = await parsePipeline(
      request,
      [{ id: 'A' }, { id: 'B' }, { id: 'C' }],
      [
        { source: 'A', target: 'B' },
        { source: 'B', target: 'C' },
        { source: 'C', target: 'A' },
      ]
    );
    expect(res.ok()).toBeTruthy();
    expect((await res.json()).is_dag).toBe(false);
  });

  test('self-loop returns is_dag false', async ({ request }) => {
    const res = await parsePipeline(request, [{ id: 'A' }], [
      { source: 'A', target: 'A' },
    ]);
    expect(res.ok()).toBeTruthy();
    expect((await res.json()).is_dag).toBe(false);
  });

  test('empty pipeline returns 400', async ({ request }) => {
    const res = await parsePipeline(request, [], []);
    expect(res.status()).toBe(400);
  });

  test('invalid JSON returns 400', async ({ request }) => {
    const res = await request.post(`${API}/pipelines/parse`, {
      form: { pipeline: 'not-json' },
    });
    expect(res.status()).toBe(400);
  });
});
