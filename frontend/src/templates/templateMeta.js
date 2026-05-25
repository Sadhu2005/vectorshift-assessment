/** Short labels + icons for template cards (keep copy minimal in UI). */
export const templateMeta = {
  'simple-llm': {
    icon: 'llm',
    tagline: 'Q&A with prompt + LLM',
    flow: ['Input', 'Text', 'LLM', 'Output'],
  },
  'rag-style': {
    icon: 'rag',
    tagline: 'Context + query variables',
    flow: ['Input', 'Text', 'LLM', 'Output'],
  },
  'api-filter': {
    icon: 'api',
    tagline: 'Fetch data, filter rows',
    flow: ['Input', 'API', 'Filter', 'Output'],
  },
  'merge-summarize': {
    icon: 'merge',
    tagline: 'Two inputs → summary',
    flow: ['Input×2', 'Merge', 'LLM', 'Output'],
  },
  'delayed-api': {
    icon: 'delay',
    tagline: 'Wait, then call API',
    flow: ['Input', 'Delay', 'API', 'Output'],
  },
  'moderation-chain': {
    icon: 'shield',
    tagline: 'Filter before LLM',
    flow: ['Input', 'Filter', 'LLM', 'Output'],
  },
  'parallel-branch': {
    icon: 'branch',
    tagline: 'Fork & merge (DAG)',
    flow: ['Input', 'Filter', 'Delay', 'Merge', 'Output'],
  },
};

export const getTemplateMeta = (id) =>
  templateMeta[id] || {
    icon: 'llm',
    tagline: 'Starter workflow',
    flow: [],
  };
