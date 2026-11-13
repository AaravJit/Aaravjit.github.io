import { mkdirSync, mkdtempSync, realpathSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { request } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { isInside, resolveRequest, startStaticServer } from './static-server.mjs';

let base: string;
let root: string;

beforeAll(() => {
  base = realpathSync(mkdtempSync(join(tmpdir(), 'static-server-')));
  root = join(base, 'out');
  mkdirSync(join(root, 'resume', 'systems'), { recursive: true });
  writeFileSync(join(root, 'index.html'), '<h1>home</h1>');
  writeFileSync(join(root, 'resume', 'systems', 'index.html'), '<h1>systems</h1>');
  writeFileSync(join(base, 'secret.txt'), 'outside the root');
  mkdirSync(join(base, 'out-sibling'));
  writeFileSync(join(base, 'out-sibling', 'x.txt'), 'sibling with a shared prefix');
  symlinkSync(join(base, 'secret.txt'), join(root, 'link-out.txt'));
  symlinkSync(base, join(root, 'dir-link'));
  symlinkSync(join(root, 'index.html'), join(root, 'link-in.html'));
});
afterAll(() => rmSync(base, { recursive: true, force: true }));

describe('isInside', () => {
  it('compares path segments, not string prefixes', () => {
    expect(isInside('/srv/out', '/srv/out')).toBe(true);
    expect(isInside('/srv/out', '/srv/out/a/b')).toBe(true);
    expect(isInside('/srv/out', '/srv/out-sibling/x')).toBe(false);
    expect(isInside('/srv/out', '/srv')).toBe(false);
  });
});

describe('resolveRequest', () => {
  it('serves files and directory index pages', () => {
    expect(resolveRequest(root, '/')).toEqual({ status: 200, file: join(root, 'index.html') });
    expect(resolveRequest(root, '/resume/systems/?x=1#top')).toEqual({ status: 200, file: join(root, 'resume', 'systems', 'index.html') });
  });
  it('returns 404 for missing files', () => {
    expect(resolveRequest(root, '/nope.html').status).toBe(404);
  });
  it.each([
    '/../secret.txt',
    '/%2e%2e/secret.txt',
    '/%2E%2E%2Fsecret.txt',
    '/resume/../../secret.txt',
    '/..%2fout-sibling/x.txt',
  ])('rejects traversal: %s', (url) => {
    expect(resolveRequest(root, url).status).toBe(403);
  });
  it.each(['/%E0%A4%A', '/%', '/%zz'])('rejects malformed percent-encoding: %s', (url) => {
    expect(resolveRequest(root, url).status).toBe(400);
  });
  it.each(['secret.txt', '//evil.example/x', '/a%00b', '/..\\secret.txt', 'http://127.0.0.1/'])('rejects malformed request targets: %s', (url) => {
    expect(resolveRequest(root, url).status).toBe(400);
  });
  it('refuses symlinks that escape the root', () => {
    expect(resolveRequest(root, '/link-out.txt').status).toBe(403);
    expect(resolveRequest(root, '/dir-link/secret.txt').status).toBe(403);
  });
  it('allows symlinks that stay inside the root', () => {
    expect(resolveRequest(root, '/link-in.html')).toEqual({ status: 200, file: join(root, 'index.html') });
  });
});

describe('startStaticServer', () => {
  const send = (origin: string, method: string, path: string) =>
    new Promise<{ status: number; body: string }>((done, fail) => {
      // Raw options, not a URL string: a URL string would be normalized by the client first.
      const { hostname, port } = new URL(origin);
      const req = request({ hostname, port, path, method }, (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => done({ status: res.statusCode ?? 0, body }));
      });
      req.on('error', fail);
      req.end();
    });

  it('binds to loopback, serves GET, refuses other methods and traversal, and closes', async () => {
    const { server, origin, close } = await startStaticServer(root);
    try {
      expect(server.address().address).toBe('127.0.0.1');
      expect(await send(origin, 'GET', '/')).toEqual({ status: 200, body: '<h1>home</h1>' });
      expect((await send(origin, 'HEAD', '/')).status).toBe(200);
      expect((await send(origin, 'POST', '/')).status).toBe(405);
      expect((await send(origin, 'GET', '/%2e%2e/secret.txt')).status).toBe(403);
      expect((await send(origin, 'GET', '/%E0%A4%A')).status).toBe(400);
    } finally {
      await close();
    }
    expect(server.listening).toBe(false);
  });
});
