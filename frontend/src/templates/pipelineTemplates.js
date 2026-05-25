import { MarkerType } from 'reactflow';

const edgeDefaults = {
  type: 'smoothstep',
  animated: true,
  markerEnd: {
    type: MarkerType.Arrow,
    height: '20px',
    width: '20px',
  },
};

const edge = (id, source, target, sourceHandle, targetHandle) => ({
  id,
  source,
  target,
  sourceHandle,
  targetHandle,
  ...edgeDefaults,
});

/**
 * Pre-built pipelines users can load, explore, then customize.
 */
export const pipelineTemplates = [
  {
    id: 'simple-llm',
    name: 'Simple LLM Chain',
    category: 'Getting started',
    description: 'Classic input → prompt template → LLM → output. Best first template.',
    useCases: [
      'Q&A over user text',
      'Single-shot summarization',
      'Learn how Text {{variables}} feed the LLM',
    ],
    nodeIDs: {
      customInput: 1,
      text: 1,
      llm: 1,
      customOutput: 1,
    },
    nodes: [
      {
        id: 'customInput-1',
        type: 'customInput',
        position: { x: 40, y: 120 },
        data: {
          id: 'customInput-1',
          nodeType: 'customInput',
          inputName: 'user_question',
          inputType: 'Text',
        },
      },
      {
        id: 'text-1',
        type: 'text',
        position: { x: 280, y: 100 },
        data: {
          id: 'text-1',
          nodeType: 'text',
          text: 'Answer this question:\n\n{{input}}',
          width: 240,
          height: 140,
        },
      },
      {
        id: 'llm-1',
        type: 'llm',
        position: { x: 560, y: 120 },
        data: { id: 'llm-1', nodeType: 'llm' },
      },
      {
        id: 'customOutput-1',
        type: 'customOutput',
        position: { x: 820, y: 120 },
        data: {
          id: 'customOutput-1',
          nodeType: 'customOutput',
          outputName: 'answer',
          outputType: 'Text',
        },
      },
    ],
    edges: [
      edge('e1', 'customInput-1', 'text-1', 'customInput-1-value', 'text-1-var-input'),
      edge('e2', 'text-1', 'llm-1', 'text-1-output', 'llm-1-prompt'),
      edge('e3', 'llm-1', 'customOutput-1', 'llm-1-response', 'customOutput-1-value'),
    ],
  },
  {
    id: 'rag-style',
    name: 'RAG-style Prompt',
    category: 'AI workflows',
    description: 'Template with context + query variables for retrieval-style flows.',
    useCases: [
      'Document Q&A (mock RAG)',
      'Separate context vs user question',
      'Document + query variable pattern',
    ],
    nodeIDs: { customInput: 1, text: 1, llm: 1, customOutput: 1 },
    nodes: [
      {
        id: 'customInput-1',
        type: 'customInput',
        position: { x: 40, y: 140 },
        data: {
          id: 'customInput-1',
          nodeType: 'customInput',
          inputName: 'documents',
          inputType: 'File',
        },
      },
      {
        id: 'text-1',
        type: 'text',
        position: { x: 260, y: 80 },
        data: {
          id: 'text-1',
          nodeType: 'text',
          text: 'Context:\n{{context}}\n\nQuestion: {{query}}\n\nAnswer:',
          width: 260,
          height: 160,
        },
      },
      {
        id: 'llm-1',
        type: 'llm',
        position: { x: 560, y: 120 },
        data: { id: 'llm-1', nodeType: 'llm' },
      },
      {
        id: 'customOutput-1',
        type: 'customOutput',
        position: { x: 820, y: 120 },
        data: {
          id: 'customOutput-1',
          nodeType: 'customOutput',
          outputName: 'rag_answer',
          outputType: 'Text',
        },
      },
    ],
    edges: [
      edge('e1', 'customInput-1', 'text-1', 'customInput-1-value', 'text-1-var-context'),
      edge('e2', 'text-1', 'llm-1', 'text-1-output', 'llm-1-prompt'),
      edge('e3', 'llm-1', 'customOutput-1', 'llm-1-response', 'customOutput-1-value'),
    ],
  },
  {
    id: 'api-filter',
    name: 'API + Filter',
    category: 'Data pipelines',
    description: 'Fetch external data, filter rows, then return results.',
    useCases: [
      'HTTP enrichment step',
      'Filter API JSON by field value',
      'Webhook-style ETL sketch',
    ],
    nodeIDs: { customInput: 1, api: 1, filter: 1, customOutput: 1 },
    nodes: [
      {
        id: 'customInput-1',
        type: 'customInput',
        position: { x: 40, y: 120 },
        data: {
          id: 'customInput-1',
          nodeType: 'customInput',
          inputName: 'request_id',
          inputType: 'Text',
        },
      },
      {
        id: 'api-1',
        type: 'api',
        position: { x: 260, y: 110 },
        data: {
          id: 'api-1',
          nodeType: 'api',
          url: 'https://api.example.com/data',
          method: 'GET',
        },
      },
      {
        id: 'filter-1',
        type: 'filter',
        position: { x: 520, y: 110 },
        data: {
          id: 'filter-1',
          nodeType: 'filter',
          condition: 'contains',
          matchValue: 'active',
          caseSensitive: false,
        },
      },
      {
        id: 'customOutput-1',
        type: 'customOutput',
        position: { x: 780, y: 120 },
        data: {
          id: 'customOutput-1',
          nodeType: 'customOutput',
          outputName: 'filtered_json',
          outputType: 'Text',
        },
      },
    ],
    edges: [
      edge('e1', 'customInput-1', 'api-1', 'customInput-1-value', 'api-1-in'),
      edge('e2', 'api-1', 'filter-1', 'api-1-out', 'filter-1-in'),
      edge('e3', 'filter-1', 'customOutput-1', 'filter-1-out', 'customOutput-1-value'),
    ],
  },
  {
    id: 'merge-summarize',
    name: 'Merge & Summarize',
    category: 'AI workflows',
    description: 'Two inputs merged before the LLM summarizes combined content.',
    useCases: [
      'Combine two data sources',
      'Dual-input summarization',
      'Parallel branch merge pattern',
    ],
    nodeIDs: { customInput: 2, merge: 1, llm: 1, customOutput: 1 },
    nodes: [
      {
        id: 'customInput-1',
        type: 'customInput',
        position: { x: 40, y: 60 },
        data: {
          id: 'customInput-1',
          nodeType: 'customInput',
          inputName: 'source_a',
          inputType: 'Text',
        },
      },
      {
        id: 'customInput-2',
        type: 'customInput',
        position: { x: 40, y: 200 },
        data: {
          id: 'customInput-2',
          nodeType: 'customInput',
          inputName: 'source_b',
          inputType: 'Text',
        },
      },
      {
        id: 'merge-1',
        type: 'merge',
        position: { x: 300, y: 120 },
        data: { id: 'merge-1', nodeType: 'merge' },
      },
      {
        id: 'llm-1',
        type: 'llm',
        position: { x: 540, y: 120 },
        data: { id: 'llm-1', nodeType: 'llm' },
      },
      {
        id: 'customOutput-1',
        type: 'customOutput',
        position: { x: 800, y: 120 },
        data: {
          id: 'customOutput-1',
          nodeType: 'customOutput',
          outputName: 'summary',
          outputType: 'Text',
        },
      },
    ],
    edges: [
      edge('e1', 'customInput-1', 'merge-1', 'customInput-1-value', 'merge-1-a'),
      edge('e2', 'customInput-2', 'merge-1', 'customInput-2-value', 'merge-1-b'),
      edge('e3', 'merge-1', 'llm-1', 'merge-1-out', 'llm-1-prompt'),
      edge('e4', 'llm-1', 'customOutput-1', 'llm-1-response', 'customOutput-1-value'),
    ],
  },
  {
    id: 'delayed-api',
    name: 'Rate-limited API',
    category: 'Data pipelines',
    description: 'Throttle requests with a delay before calling an external API.',
    useCases: [
      'Avoid API rate limits',
      'Scheduled / throttled fetch',
      'Simple sequential automation',
    ],
    nodeIDs: { customInput: 1, delay: 1, api: 1, customOutput: 1 },
    nodes: [
      {
        id: 'customInput-1',
        type: 'customInput',
        position: { x: 40, y: 120 },
        data: {
          id: 'customInput-1',
          nodeType: 'customInput',
          inputName: 'trigger',
          inputType: 'Text',
        },
      },
      {
        id: 'delay-1',
        type: 'delay',
        position: { x: 260, y: 120 },
        data: { id: 'delay-1', nodeType: 'delay', seconds: 2 },
      },
      {
        id: 'api-1',
        type: 'api',
        position: { x: 480, y: 110 },
        data: {
          id: 'api-1',
          nodeType: 'api',
          url: 'https://api.example.com/run',
          method: 'POST',
        },
      },
      {
        id: 'customOutput-1',
        type: 'customOutput',
        position: { x: 740, y: 120 },
        data: {
          id: 'customOutput-1',
          nodeType: 'customOutput',
          outputName: 'api_result',
          outputType: 'Text',
        },
      },
    ],
    edges: [
      edge('e1', 'customInput-1', 'delay-1', 'customInput-1-value', 'delay-1-in'),
      edge('e2', 'delay-1', 'api-1', 'delay-1-out', 'api-1-in'),
      edge('e3', 'api-1', 'customOutput-1', 'api-1-out', 'customOutput-1-value'),
    ],
  },
  {
    id: 'moderation-chain',
    name: 'Content Filter + LLM',
    category: 'Safety',
    description: 'Filter text before it reaches the LLM — drop or pass based on rules.',
    useCases: [
      'Block banned keywords',
      'Pre-LLM moderation gate',
      'Regex allowlist patterns',
    ],
    nodeIDs: { customInput: 1, filter: 1, llm: 1, customOutput: 1, note: 1 },
    nodes: [
      {
        id: 'customInput-1',
        type: 'customInput',
        position: { x: 40, y: 120 },
        data: {
          id: 'customInput-1',
          nodeType: 'customInput',
          inputName: 'user_text',
          inputType: 'Text',
        },
      },
      {
        id: 'filter-1',
        type: 'filter',
        position: { x: 280, y: 100 },
        data: {
          id: 'filter-1',
          nodeType: 'filter',
          condition: 'not_contains',
          matchValue: 'spam',
          caseSensitive: false,
        },
      },
      {
        id: 'llm-1',
        type: 'llm',
        position: { x: 520, y: 120 },
        data: { id: 'llm-1', nodeType: 'llm' },
      },
      {
        id: 'customOutput-1',
        type: 'customOutput',
        position: { x: 780, y: 120 },
        data: {
          id: 'customOutput-1',
          nodeType: 'customOutput',
          outputName: 'safe_response',
          outputType: 'Text',
        },
      },
      {
        id: 'note-1',
        type: 'note',
        position: { x: 280, y: 280 },
        data: {
          id: 'note-1',
          nodeType: 'note',
          content: 'Filter blocks rows where text contains "spam". Adjust match value as needed.',
        },
      },
    ],
    edges: [
      edge('e1', 'customInput-1', 'filter-1', 'customInput-1-value', 'filter-1-in'),
      edge('e2', 'filter-1', 'llm-1', 'filter-1-out', 'llm-1-prompt'),
      edge('e3', 'llm-1', 'customOutput-1', 'llm-1-response', 'customOutput-1-value'),
    ],
  },
  {
    id: 'parallel-branch',
    name: 'Parallel Branch (DAG)',
    category: 'Advanced',
    description: 'One input splits to two paths, then merges — valid DAG for submit testing.',
    useCases: [
      'Parallel processing demo',
      'Test DAG validation (no cycles)',
      'Fork / join pattern',
    ],
    nodeIDs: { customInput: 1, filter: 1, delay: 1, merge: 1, customOutput: 1 },
    nodes: [
      {
        id: 'customInput-1',
        type: 'customInput',
        position: { x: 40, y: 140 },
        data: {
          id: 'customInput-1',
          nodeType: 'customInput',
          inputName: 'payload',
          inputType: 'Text',
        },
      },
      {
        id: 'filter-1',
        type: 'filter',
        position: { x: 260, y: 60 },
        data: {
          id: 'filter-1',
          nodeType: 'filter',
          condition: 'is_not_empty',
          matchValue: '',
          caseSensitive: false,
        },
      },
      {
        id: 'delay-1',
        type: 'delay',
        position: { x: 260, y: 220 },
        data: { id: 'delay-1', nodeType: 'delay', seconds: 1 },
      },
      {
        id: 'merge-1',
        type: 'merge',
        position: { x: 520, y: 140 },
        data: { id: 'merge-1', nodeType: 'merge' },
      },
      {
        id: 'customOutput-1',
        type: 'customOutput',
        position: { x: 780, y: 140 },
        data: {
          id: 'customOutput-1',
          nodeType: 'customOutput',
          outputName: 'result',
          outputType: 'Text',
        },
      },
    ],
    edges: [
      edge('e1', 'customInput-1', 'filter-1', 'customInput-1-value', 'filter-1-in'),
      edge('e2', 'customInput-1', 'delay-1', 'customInput-1-value', 'delay-1-in'),
      edge('e3', 'filter-1', 'merge-1', 'filter-1-out', 'merge-1-a'),
      edge('e4', 'delay-1', 'merge-1', 'delay-1-out', 'merge-1-b'),
      edge('e5', 'merge-1', 'customOutput-1', 'merge-1-out', 'customOutput-1-value'),
    ],
  },
];

export const templateCategories = [
  'Getting started',
  'AI workflows',
  'Data pipelines',
  'Safety',
  'Advanced',
];
