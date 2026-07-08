declare const process: { env: Record<string, string | undefined> };

const SESSION_COOKIE = 'ym_session';
const SESSION_MAX_AGE = 60 * 60 * 8;

const EXPERT_PATHS = new Set([
  '/design-v1/mock/09-standard-7axis.html',
  '/design-v1/mock/10-normalize-exceptions.html',
  '/design-v1/mock/11-mapper-viewer.html',
  '/design-v1/mock/12-rd-builder.html',
  '/design-v1/mock/13-pro-community.html',
  '/design-v1/mock/15-rd-business.html'
]);

const ADMIN_PATHS = new Set([
  '/design-v1/mock/14-crm-admin.html'
]);

function parseCookies(cookieHeader: string) {
  const out: Record<string, string> = {};
  (cookieHeader || '').split(';').forEach((part) => {
    const idx = part.indexOf('=');
    if (idx <= 0) return;
    const key = part.slice(0, idx).trim();
    const value = decodeURIComponent(part.slice(idx + 1).trim());
    out[key] = value;
  });
  return out;
}

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function hmacHex(payload: string, secret: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  return toHex(signature);
}

async function verifySessionToken(token: string, secret: string, nowSec = Math.floor(Date.now() / 1000)) {
  if (!token || !secret) return '';
  const match = String(token).match(/^(expert|admin)\.(\d{10})\.([a-f0-9]{64})$/i);
  if (!match) return '';
  const role = match[1];
  const issuedAt = Number(match[2]);
  const signature = match[3].toLowerCase();
  if (!Number.isFinite(issuedAt)) return '';
  if (issuedAt > nowSec + 300) return '';
  if (nowSec - issuedAt > SESSION_MAX_AGE) return '';
  const expected = await hmacHex(`${role}.${issuedAt}`, secret);
  return signature === expected ? role : '';
}

function requiredRole(pathname: string) {
  if (ADMIN_PATHS.has(pathname)) return 'admin';
  if (EXPERT_PATHS.has(pathname)) return 'expert';
  return '';
}

export default async function middleware(request: Request) {
  const url = new URL(request.url);
  const need = requiredRole(url.pathname);
  if (!need) return;

  const secret = process.env.YM_SESSION_SECRET || '';
  const cookies = parseCookies(request.headers.get('cookie') || '');
  const role = await verifySessionToken(cookies[SESSION_COOKIE] || '', secret);
  const allowed = need === 'admin' ? role === 'admin' : role === 'expert' || role === 'admin';

  if (allowed) return;

  const redirectUrl = new URL('/design-v1/mock/01-landing.html', request.url);
  redirectUrl.searchParams.set('denied', need);
  redirectUrl.searchParams.set('next', url.pathname);
  return Response.redirect(redirectUrl, 307);
}

export const config = {
  matcher: [
    '/design-v1/mock/09-standard-7axis.html',
    '/design-v1/mock/10-normalize-exceptions.html',
    '/design-v1/mock/11-mapper-viewer.html',
    '/design-v1/mock/12-rd-builder.html',
    '/design-v1/mock/13-pro-community.html',
    '/design-v1/mock/14-crm-admin.html',
    '/design-v1/mock/15-rd-business.html'
  ]
};
