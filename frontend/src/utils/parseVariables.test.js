import { parseVariables } from './parseVariables';

describe('parseVariables', () => {
  it('parses multiple variables', () => {
    expect(parseVariables('{{name}} {{email}} {{query}}')).toEqual([
      'name',
      'email',
      'query',
    ]);
  });

  it('allows whitespace inside braces', () => {
    expect(parseVariables('{{ name }} {{email}}')).toEqual(['name', 'email']);
  });

  it('deduplicates repeated variables', () => {
    expect(parseVariables('{{name}} {{name}}')).toEqual(['name']);
  });

  it('rejects invalid identifiers', () => {
    expect(parseVariables('{{bad-name}}')).toEqual([]);
  });

  it('returns empty for plain text', () => {
    expect(parseVariables('no vars')).toEqual([]);
    expect(parseVariables('')).toEqual([]);
  });
});
