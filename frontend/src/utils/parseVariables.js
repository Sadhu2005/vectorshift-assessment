const VAR_REGEX = /\{\{\s*([a-zA-Z_$][\w$]*)\s*\}\}/g;

/** Extract unique `{{variable}}` names from template text. */
export const parseVariables = (text) => {
  const names = new Set();
  let match;
  const re = new RegExp(VAR_REGEX.source, 'g');
  while ((match = re.exec(text || '')) !== null) {
    names.add(match[1]);
  }
  return Array.from(names);
};
