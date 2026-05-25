import { createNodeComponent } from './createNodeComponent';
import { TextNode } from './textNode';
import { nodeConfigs } from './nodeConfigs';

const configTypes = Object.keys(nodeConfigs);

export const nodeTypes = configTypes.reduce((acc, type) => {
  acc[type] = createNodeComponent(type);
  return acc;
}, {});

nodeTypes.text = TextNode;

export const toolbarNodes = [
  { type: 'customInput', label: 'Input', category: 'Input' },
  { type: 'text', label: 'Text', category: 'Input' },
  { type: 'llm', label: 'LLM', category: 'Transform' },
  { type: 'filter', label: 'Filter', category: 'Transform' },
  { type: 'merge', label: 'Merge', category: 'Transform' },
  { type: 'api', label: 'API', category: 'Transform' },
  { type: 'delay', label: 'Delay', category: 'Transform' },
  { type: 'customOutput', label: 'Output', category: 'Output' },
  { type: 'note', label: 'Note', category: 'Utility' },
];
