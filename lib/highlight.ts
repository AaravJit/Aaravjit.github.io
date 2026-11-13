/**
 * Tiny build-time syntax highlighter for short excerpts (TypeScript, SQL, Bash, Python, Swift).
 * Runs in server components only, so no highlighter ships to the browser.
 * It is deliberately approximate: comments, strings, numbers and keywords.
 */
export type Token = { text: string; kind?: 'key' | 'str' | 'num' | 'com' };

const KEYWORDS = new Set([
  // TS / JS / Swift / Python / Bash
  'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'await', 'async', 'import', 'export', 'from', 'new', 'typeof', 'as', 'in', 'of', 'true', 'false', 'null', 'undefined', 'public', 'struct', 'enum', 'case', 'guard', 'def', 'None', 'not', 'and', 'or', 'then', 'fi', 'trap', 'echo', 'local', 'class', 'self', 'try', 'catch',
  // SQL (case-insensitive below)
  'select', 'insert', 'update', 'delete', 'create', 'replace', 'alter', 'table', 'policy', 'enable', 'row', 'level', 'security', 'on', 'using', 'with', 'check', 'where', 'returns', 'language', 'when', 'end', 'or', 'definer', 'stable', 'begin', 'set', 'is', 'type', 'grant', 'revoke', 'order', 'by', 'limit', 'join', 'skip', 'locked',
]);

const PATTERN = /((?<=^|\s)\/\/[^\n]*|(?<=^|\s)--(?=\s)[^\n]*|(?<=^|\s)#(?![!{\[])[^\n]*|\/\*[\s\S]*?\*\/|"""[\s\S]*?"""|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\.|[^`\\])*`)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][A-Za-z0-9_]*)/gm;

export function highlight(code: string): Token[] {
  const tokens: Token[] = [];
  let last = 0;
  for (const match of code.matchAll(PATTERN)) {
    const index = match.index ?? 0;
    if (index > last) tokens.push({ text: code.slice(last, index) });
    const [text, commentOrString, number, word] = match;
    if (commentOrString) {
      const isComment = /^(\/\/|--|#|\/\*)/.test(commentOrString);
      tokens.push({ text, kind: isComment ? 'com' : 'str' });
    } else if (number) tokens.push({ text, kind: 'num' });
    else if (word && KEYWORDS.has(word.toLowerCase()) && (word === word.toLowerCase() || word === word.toUpperCase())) tokens.push({ text, kind: 'key' });
    else tokens.push({ text });
    last = index + text.length;
  }
  if (last < code.length) tokens.push({ text: code.slice(last) });
  return tokens;
}
