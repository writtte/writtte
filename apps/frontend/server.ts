// biome-ignore-all lint/correctness/noNodejsModules: NodeJS modules are required in this script
// biome-ignore-all lint/correctness/noProcessGlobal: Global processes are required in this script

import { join, resolve } from 'node:path';
import { type BunFile, file, serve } from 'bun';

type CacheHeaders = Record<string, string>;

type SecurityHeaders = Record<string, string>;

const port: number = Number(process.env.PORT) || 3000;
const isProduction: boolean = process.env.NODE_ENV === 'production';
const allowedOrigins: string[] = process.env.ALLOWED_ORIGINS?.split(',') || [
  '*',
];

const appDir: string = import.meta.dir;

const filePathRegex = /\.\w+$/;

const isFileRequest = (pathname: string): boolean =>
  filePathRegex.test(pathname);

const getCacheHeaders = (pathname: string): CacheHeaders => {
  if (pathname.startsWith('/assets/')) {
    return {
      'Cache-Control': 'public, max-age=31536000, immutable',
    };
  }

  if (pathname.endsWith('.html') || pathname === '/') {
    return {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
    };
  }

  return {
    'Cache-Control': 'public, max-age=3600',
  };
};

const getSecurityHeaders = (): SecurityHeaders => {
  const headers: SecurityHeaders = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    'Content-Security-Policy':
      "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self';",
  };

  if (isProduction) {
    headers['Strict-Transport-Security'] =
      'max-age=31536000; includeSubDomains; preload';
  }

  return headers;
};

const getMimeType = (pathname: string): string => {
  const ext = pathname.split('.').pop()?.toLowerCase();

  const mimeTypes: Record<string, string> = {
    html: 'text/html; charset=utf-8',
    js: 'application/javascript; charset=utf-8',
    mjs: 'application/javascript; charset=utf-8',
    css: 'text/css; charset=utf-8',
    json: 'application/json; charset=utf-8',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    svg: 'image/svg+xml',
    webp: 'image/webp',
    ico: 'image/x-icon',
    woff: 'font/woff',
    woff2: 'font/woff2',
    ttf: 'font/ttf',
    eot: 'application/vnd.ms-fontobject',
    otf: 'font/otf',
    webmanifest: 'application/manifest+json',
    xml: 'application/xml',
    pdf: 'application/pdf',
  };

  return mimeTypes[ext || ''] || 'application/octet-stream';
};

const getCorsHeaders = (origin: string | null): Record<string, string> => {
  if (allowedOrigins[0] === '*') {
    return {
      'Access-Control-Allow-Origin': '*',
    };
  }

  if (origin && allowedOrigins.includes(origin)) {
    return {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Credentials': 'true',
      Vary: 'Origin',
    };
  }

  return {};
};

const isPathTraversalAttempt = (
  filePath: string,
  appDirResolved: string,
): boolean => {
  const resolvedPath = resolve(filePath);
  return !resolvedPath.startsWith(appDirResolved);
};

const createFileResponse = (
  targetFile: BunFile,
  pathname: string,
  origin: string | null,
): Response =>
  new Response(targetFile, {
    headers: {
      'Content-Type': getMimeType(pathname),
      ...getCacheHeaders(pathname),
      ...getSecurityHeaders(),
      ...getCorsHeaders(origin),
    },
  });

const createErrorResponse = (
  message: string,
  status: number,
  origin: string | null,
): Response =>
  new Response(message, {
    status,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      ...getSecurityHeaders(),
      ...getCorsHeaders(origin),
    },
  });

const resolvedAppDir: string = resolve(appDir);

serve({
  port: port,
  fetch: async (req: Request): Promise<Response> => {
    const url: URL = new URL(req.url);
    const origin: string | null = req.headers.get('Origin');

    let pathname: string = url.pathname;

    try {
      if (req.method === 'OPTIONS') {
        return new Response(null, {
          status: 204,
          headers: {
            ...getSecurityHeaders(),
            ...getCorsHeaders(origin),
            'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Max-Age': '86400',
          },
        });
      }

      if (req.method !== 'GET' && req.method !== 'HEAD') {
        return createErrorResponse('Method Not Allowed', 405, origin);
      }

      pathname = decodeURIComponent(pathname);

      if (pathname === '/') {
        pathname = '/index.html';
      }

      const filePath: string = join(appDir, pathname);

      if (isPathTraversalAttempt(filePath, resolvedAppDir)) {
        return createErrorResponse('Forbidden', 403, origin);
      }

      const targetFile: BunFile = file(filePath);
      const fileExists: boolean = await targetFile.exists();

      if (fileExists) {
        return createFileResponse(targetFile, pathname, origin);
      }

      if (!isFileRequest(pathname)) {
        const indexFile: BunFile = file(join(appDir, 'index.html'));
        const indexExists: boolean = await indexFile.exists();

        if (indexExists) {
          return createFileResponse(indexFile, '/index.html', origin);
        }

        return createErrorResponse('Application Error', 500, origin);
      }

      return createErrorResponse('Not Found', 404, origin);
    } catch {
      return createErrorResponse('Internal Server Error', 500, origin);
    }
  },
  error(): Response {
    return new Response('Internal Server Error', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        ...getSecurityHeaders(),
      },
    });
  },
});

// biome-ignore lint/suspicious/noConsole: Console log is required here
console.log(`
Server started successfully!
-----------------------------------------
Local:      http://localhost:${port}
Network:    http://0.0.0.0:${port}
Serving:    ${resolve(appDir)}
Mode:       ${isProduction ? 'production' : 'development'}
CORS:       ${allowedOrigins[0] === '*' ? 'All origins' : allowedOrigins.join(', ')}
-----------------------------------------
`);
