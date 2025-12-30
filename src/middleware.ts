import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();

  // Set CORS headers for development
  if (import.meta.env.DEV) {
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  }

  // Set CSP headers to allow blob: URLs for file downloads
  const csp = [
    "default-src 'self' blob: data:",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://plausible.io https://cdnjs.cloudflare.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https: http:",
    "connect-src 'self' https://api.ippriv.com https://*.basemaps.cartocdn.com http://localhost:* ws://localhost:*",
    "frame-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
  ].join('; ');

  response.headers.set('Content-Security-Policy', csp);

  return response;
});
