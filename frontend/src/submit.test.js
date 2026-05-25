import { formatPipelineAlert } from './submit';

describe('formatPipelineAlert', () => {
  it('formats a valid DAG result', () => {
    const message = formatPipelineAlert({
      num_nodes: 3,
      num_edges: 2,
      is_dag: true,
    });
    expect(message).toContain('Number of nodes: 3');
    expect(message).toContain('Number of edges: 2');
    expect(message).toContain('Is DAG: Yes');
  });

  it('formats a cyclic graph result', () => {
    const message = formatPipelineAlert({
      num_nodes: 3,
      num_edges: 3,
      is_dag: false,
    });
    expect(message).toContain('Is DAG: No');
    expect(message).toContain('cycle');
  });
});
