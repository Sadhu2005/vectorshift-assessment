import { Position } from 'reactflow';

export const nodeConfigs = {
  customInput: {
    title: 'Input',
    accent: 'emerald',
    minWidth: 200,
    minHeight: 100,
    fields: [
      { name: 'inputName', label: 'Name', type: 'text', defaultFromId: (id) => id.replace('customInput-', 'input_') },
      {
        name: 'inputType',
        label: 'Type',
        type: 'select',
        options: [
          { value: 'Text', label: 'Text' },
          { value: 'File', label: 'File' },
        ],
        default: 'Text',
      },
    ],
    handles: [{ type: 'source', position: Position.Right, idSuffix: 'value' }],
  },

  customOutput: {
    title: 'Output',
    accent: 'rose',
    minWidth: 200,
    minHeight: 100,
    fields: [
      { name: 'outputName', label: 'Name', type: 'text', defaultFromId: (id) => id.replace('customOutput-', 'output_') },
      {
        name: 'outputType',
        label: 'Type',
        type: 'select',
        options: [
          { value: 'Text', label: 'Text' },
          { value: 'Image', label: 'Image' },
        ],
        default: 'Text',
      },
    ],
    handles: [{ type: 'target', position: Position.Left, idSuffix: 'value' }],
  },

  llm: {
    title: 'LLM',
    accent: 'violet',
    minWidth: 200,
    minHeight: 100,
    description: 'Large language model step',
    fields: [],
    handles: [
      { type: 'target', position: Position.Left, idSuffix: 'system', style: { top: '33%' } },
      { type: 'target', position: Position.Left, idSuffix: 'prompt', style: { top: '66%' } },
      { type: 'source', position: Position.Right, idSuffix: 'response' },
    ],
  },

  filter: {
    title: 'Filter',
    accent: 'amber',
    minWidth: 200,
    minHeight: 100,
    fields: [
      {
        name: 'condition',
        label: 'Condition',
        type: 'select',
        options: [
          { value: 'contains', label: 'Contains' },
          { value: 'equals', label: 'Equals' },
          { value: 'regex', label: 'Regex' },
        ],
        default: 'contains',
      },
    ],
    handles: [
      { type: 'target', position: Position.Left, idSuffix: 'in' },
      { type: 'source', position: Position.Right, idSuffix: 'out' },
    ],
  },

  merge: {
    title: 'Merge',
    accent: 'cyan',
    minWidth: 200,
    minHeight: 100,
    description: 'Combine two inputs',
    fields: [],
    handles: [
      { type: 'target', position: Position.Left, idSuffix: 'a', style: { top: '33%' } },
      { type: 'target', position: Position.Left, idSuffix: 'b', style: { top: '66%' } },
      { type: 'source', position: Position.Right, idSuffix: 'out' },
    ],
  },

  api: {
    title: 'API',
    accent: 'blue',
    minWidth: 220,
    minHeight: 110,
    fields: [
      { name: 'url', label: 'URL', type: 'text', default: 'https://api.example.com' },
      {
        name: 'method',
        label: 'Method',
        type: 'select',
        options: [
          { value: 'GET', label: 'GET' },
          { value: 'POST', label: 'POST' },
        ],
        default: 'GET',
      },
    ],
    handles: [
      { type: 'target', position: Position.Left, idSuffix: 'in' },
      { type: 'source', position: Position.Right, idSuffix: 'out' },
    ],
  },

  delay: {
    title: 'Delay',
    accent: 'orange',
    minWidth: 200,
    minHeight: 90,
    fields: [
      { name: 'seconds', label: 'Seconds', type: 'number', default: 1, min: 0, max: 3600 },
    ],
    handles: [
      { type: 'target', position: Position.Left, idSuffix: 'in' },
      { type: 'source', position: Position.Right, idSuffix: 'out' },
    ],
  },

  note: {
    title: 'Note',
    accent: 'slate',
    minWidth: 220,
    minHeight: 120,
    fields: [
      { name: 'content', label: 'Note', type: 'textarea', default: 'Add a comment...', rows: 3 },
    ],
    handles: [],
  },
};

export const getDefaultNodeData = (type, nodeId) => {
  if (type === 'text') {
    return { id: nodeId, nodeType: type, text: '{{input}}' };
  }

  const config = nodeConfigs[type];
  if (!config) return { id: nodeId, nodeType: type };

  const data = { id: nodeId, nodeType: type };
  config.fields?.forEach((field) => {
    if (field.defaultFromId) {
      data[field.name] = field.defaultFromId(nodeId);
    } else if (field.default !== undefined) {
      data[field.name] = field.default;
    }
  });
  return data;
};
