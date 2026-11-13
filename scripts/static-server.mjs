/**
 * A minimal, loopback-only static file server for the static export (out/), used by the résumé
 * PDF build. It only answers GET and HEAD, and it only serves regular files whose real path (after
 * following symlinks) is inside the root directory.
 */
import { createReadStream, realpathSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, isAbsolute, join, relative, resolve, sep } from 'node:path';

export const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
};

/** True when `child` is `parent` or inside it. Compares path segments, not string prefixes. */
export function isInside(parent, child) {
  const rel = relative(parent, child);
  return rel === '' || (!rel.startsWith('..' + sep) && rel !== '..' && !isAbsolute(rel));
}

/**
 * Maps a request URL to a file under `root`, or explains why it can't.
 * Returns { status: 200, file } or { status: 400 | 403 | 404 }.
 * `root` must already be a real (symlink-free) absolute path.
 */
export function resolveRequest(root, rawUrl) {
  if (typeof rawUrl !== 'string' || !rawUrl.startsWith('/') || rawUrl.startsWith('//')) return { status: 400 };
  const pathPart = rawUrl.split(/[?#]/, 1)[0];
  let decoded;
  try {
    decoded = decodeURIComponent(pathPart);
  } catch {
    return { status: 400 }; // malformed percent-encoding
  }
  if (decoded.includes('\0') || decoded.includes('\\')) return { status: 400 };
  // Reject any ".." segment outright instead of trying to normalize around it.
  if (decoded.split('/').some((segment) => segment === '..')) return { status: 403 };

  let candidate = resolve(root, '.' + decoded);
  if (!isInside(root, candidate)) return { status: 403 };

  let stats;
  try {
    stats = statSync(candidate);
  } catch {
    return { status: 404 };
  }
  if (stats.isDirectory()) {
    candidate = join(candidate, 'index.html');
    try {
      stats = statSync(candidate);
    } catch {
      return { status: 404 };
    }
  }
  if (!stats.isFile()) return { status: 404 };

  // Follow symlinks and check again, so a link inside out/ can't point outside it.
  let real;
  try {
    real = realpathSync(candidate);
  } catch {
    return { status: 404 };
  }
  if (!isInside(root, real)) return { status: 403 };
  return { status: 200, file: real };
}

/** Starts the server on 127.0.0.1 and an ephemeral port. Resolves to { server, origin, close }. */
export function startStaticServer(rootDir) {
  const root = realpathSync(rootDir);
  const server = createServer((req, res) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405, { allow: 'GET, HEAD' });
      res.end();
      return;
    }
    const result = resolveRequest(root, req.url ?? '');
    if (result.status !== 200) {
      res.writeHead(result.status, { 'content-type': 'text/plain; charset=utf-8' });
      res.end(String(result.status));
      return;
    }
    res.writeHead(200, {
      'content-type': CONTENT_TYPES[extname(result.file)] ?? 'application/octet-stream',
      'x-content-type-options': 'nosniff',
    });
    if (req.method === 'HEAD') { res.end(); return; }
    const stream = createReadStream(result.file);
    stream.on('error', () => res.destroy());
    stream.pipe(res);
  });
  return new Promise((resolvePromise, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      const close = () => new Promise((done) => { server.closeAllConnections?.(); server.close(() => done()); });
      resolvePromise({ server, origin: `http://127.0.0.1:${port}`, close });
    });
  });
}
