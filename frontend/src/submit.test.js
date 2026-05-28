import { formatPipelineAlert } from './submit';

describe('formatPipelineAlert', () => {
  it('formats a valid DAG result', () => {
    const message = formatPipelineAlert({
      num_nodes: 3,
      num_edges: 2,
      is_dag: true,
      isolated_nodes: [],
      missing_required_inputs: {},
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
      isolated_nodes: [],
      missing_required_inputs: {},
    });
    expect(message).toContain('Is DAG: No');
    expect(message).toContain('cycle');
  });

  it('includes warnings for isolated nodes and missing inputs', () => {
    const message = formatPipelineAlert({
      num_nodes: 2,
      num_edges: 0,
      is_dag: true,
      isolated_nodes: ['api-1'],
      missing_required_inputs: { 'customOutput-1': ['customOutput-1-value'] },
    });
    expect(message).toContain('Warnings');
    expect(message).toContain('Isolated nodes');
    expect(message).toContain('Missing required inputs');
    expect(message).toContain('customOutput-1-value');
  });
});
