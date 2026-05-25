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
    minWidth: 220,
    minHeight: 130,
    description: 'Keep or drop rows by string rules',
    fields: [
      {
        name: 'condition',
        label: 'Rule',
        type: 'select',
        options: [
          { value: 'contains', label: 'Contains' },
          { value: 'not_contains', label: 'Does not contain' },
          { value: 'equals', label: 'Equals' },
          { value: 'starts_with', label: 'Starts with' },
          { value: 'ends_with', label: 'Ends with' },
          { value: 'regex', label: 'Matches regex' },
          { value: 'is_empty', label: 'Is empty' },
          { value: 'is_not_empty', label: 'Is not empty' },
        ],
        default: 'contains',
      },
      {
        name: 'matchValue',
        label: 'Match value',
        type: 'text',
        default: '',
        showWhen: {
          field: 'condition',
          notIn: ['is_empty', 'is_not_empty'],
        },
      },
      {
        name: 'caseSensitive',
        label: 'Case sensitive match',
        type: 'checkbox',
        default: false,
        showWhen: {
          field: 'condition',
          notIn: ['is_empty', 'is_not_empty', 'regex'],
        },
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
