const crypto = require('crypto');

const SESSION_COOKIE = 'ym_session';
const SESSION_MAX_AGE = 60 * 60 * 8;
const ALLOWED_ROLES = new Set(['expert', 'admin']);

function parseCookies(cookieHeader) {
  const out = {};
  (cookieHeader || '').split(';').forEach(part => {
    const idx = part.indexOf('=');
    if (idx <= 0) return;
    const key = part.slice(0, idx).trim();
    const value = decodeURIComponent(part.slice(idx + 1).trim());
    out[key] = value;
  });
  return out;
}

function json(res, status, payload, headers = {}) {
  res.statusCode = status;
  Object.entries({
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    ...headers
  }).forEach(([k, v]) => res.setHeader(k, v));
  res.end(JSON.stringify(payload));
}

function cookieOptions(maxAge = SESSION_MAX_AGE) {
  return [
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    'Secure',
    `Max-Age=${Math.max(0, maxAge)}`
  ].join('; ');
}

function accessCodes() {
  return {
    expert: process.env.YM_EXPERT_CODE || '',
    admin: process.env.YM_ADMIN_CODE || ''
  };
}

function sessionSecret() {
  return process.env.YM_SESSION_SECRET || '';
}

function hmacHex(payload, secret) {
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

function createSessionToken(role, nowSec = Math.floor(Date.now() / 1000)) {
  const secret = sessionSecret();
  if (!ALLOWED_ROLES.has(role) || !secret) return '';
  const issuedAt = String(nowSec);
  const payload = `${role}.${issuedAt}`;
  const signature = hmacHex(payload, secret);
  return `${payload}.${signature}`;
}

function safeEqual(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

function verifySessionToken(token, nowSec = Math.floor(Date.now() / 1000), maxAge = SESSION_MAX_AGE) {
  const secret = sessionSecret();
  if (!token || !secret) return '';
  const match = String(token).match(/^(expert|admin)\.(\d{10})\.([a-f0-9]{64})$/i);
  if (!match) return '';
  const role = match[1];
  const issuedAt = Number(match[2]);
  const signature = match[3].toLowerCase();
  if (!ALLOWED_ROLES.has(role) || !Number.isFinite(issuedAt)) return '';
  if (issuedAt > nowSec + 300) return '';
  if (nowSec - issuedAt > maxAge) return '';
  const expected = hmacHex(`${role}.${issuedAt}`, secret);
  return safeEqual(signature, expected) ? role : '';
}

module.exports = {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  ALLOWED_ROLES,
  parseCookies,
  json,
  cookieOptions,
  accessCodes,
  sessionSecret,
  createSessionToken,
  verifySessionToken
};
