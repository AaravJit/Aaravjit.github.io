import { describe, expect, it } from 'vitest';
import { highlight } from './highlight';

const kinds = (code: string) => highlight(code).filter((t) => t.kind).map((t) => `${t.kind}:${t.text}`);

describe('highlight', () => {
  it('round-trips the source text exactly', () => {
    const code = `const a = "x"; // note\nselect * from t where id = 1;\n./install.sh --dry-run   # detect`;
    expect(highlight(code).map((t) => t.text).join('')).toBe(code);
  });
  it('marks comments, strings, numbers and keywords', () => {
    expect(kinds('const n = 42; // done')).toEqual(['key:const', 'num:42', 'com:// done']);
    expect(kinds("WHEN d <= 800 THEN 'near' -- band")).toEqual(['key:WHEN', 'num:800', 'key:THEN', "str:'near'", 'com:-- band']);
  });
  it('does not treat command-line flags or URLs as comments', () => {
    expect(kinds('./install.sh --dry-run')).toEqual([]);
    expect(kinds('fetch("https://x.dev/#a")')).toEqual(['str:"https://x.dev/#a"']);
  });
});
