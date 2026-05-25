/**
 * Filter conditions supported in the UI (string matching semantics for demo/editor).
 * Conditions not listed here should not appear in the Filter node dropdown.
 */
export const FILTER_CONDITIONS = [
  {
    value: 'contains',
    label: 'Contains',
    needsValue: true,
    hint: 'Pass when text includes this substring',
  },
  {
    value: 'not_contains',
    label: 'Does not contain',
    needsValue: true,
    hint: 'Pass when text does NOT include substring',
  },
  {
    value: 'equals',
    label: 'Equals',
    needsValue: true,
    hint: 'Exact match (case option below)',
  },
  {
    value: 'starts_with',
    label: 'Starts with',
    needsValue: true,
    hint: 'Pass when text begins with value',
  },
  {
    value: 'ends_with',
    label: 'Ends with',
    needsValue: true,
    hint: 'Pass when text ends with value',
  },
  {
    value: 'regex',
    label: 'Matches regex',
    needsValue: true,
    hint: 'JavaScript RegExp pattern, e.g. ^[A-Z]+$',
  },
  {
    value: 'is_empty',
    label: 'Is empty',
    needsValue: false,
    hint: 'Pass when input is blank or whitespace only',
  },
  {
    value: 'is_not_empty',
    label: 'Is not empty',
    needsValue: false,
    hint: 'Pass when input has any non-whitespace text',
  },
];

export const filterConditionNeedsValue = (condition) => {
  const found = FILTER_CONDITIONS.find((c) => c.value === condition);
  return found ? found.needsValue : true;
};

export const getFilterConditionHint = (condition) => {
  return FILTER_CONDITIONS.find((c) => c.value === condition)?.hint || '';
};
