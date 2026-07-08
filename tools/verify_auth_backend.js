const { EventEmitter } = require('events');
const assert = require('assert');

process.env.YM_EXPERT_CODE = 'expert-test-code';
process.env.YM_ADMIN_CODE = 'admin-test-code';
process.env.YM_SESSION_SECRET = 'session-secret-for-tests';

const util = require('../api/auth/_util');
const login = require('../api/auth/login');
const session = require('../api/auth/session');
const logout = require('../api/auth/logout');

function createReq(method = 'GET', body = null, cookie = '') {
  const req = new EventEmitter();
  req.method = method;
  req.headers = {};
  if (cookie) req.headers.cookie = cookie;
  process.nextTick(() => {
    if (body !== null) req.emit('data', Buffer.from(JSON.stringify(body)));
    req.emit('end');
  });
  return req;
}

function createRes() {
  return {
    statusCode: 200,
    headers: {},
    body: '',
    setHeader(name, value) { this.headers[name] = value; },
    end(payload) { this.body = payload; if (this._resolve) this._resolve(this); },
    wait() { return new Promise((resolve) => { this._resolve = resolve; }); }
  };
}

(async () => {
  const token = util.createSessionToken('expert', 1700000000);
  assert(token.includes('expert.1700000000.'));
  assert.strictEqual(util.verifySessionToken(token, 1700000001), 'expert');
  assert.strictEqual(util.verifySessionToken('expert.1700000000.invalid', 1700000001), '');

  let req = createReq('POST', { role: 'expert', code: 'expert-test-code' });
  let res = createRes();
  login(req, res);
  await res.wait();
  assert.strictEqual(res.statusCode, 200);
  const loginPayload = JSON.parse(res.body);
  assert.strictEqual(loginPayload.ok, true);
  const setCookie = res.headers['Set-Cookie'];
  assert(Array.isArray(setCookie));
  const sessionCookie = setCookie.find((v) => v.startsWith('ym_session='));
  assert(sessionCookie);

  req = createReq('GET', null, sessionCookie.split(';')[0]);
  res = createRes();
  session(req, res);
  await res.wait();
  assert.strictEqual(JSON.parse(res.body).role, 'expert');

  req = createReq('POST', { role: 'expert', code: 'wrong' });
  res = createRes();
  login(req, res);
  await res.wait();
  assert.strictEqual(res.statusCode, 401);

  req = createReq('POST', null, sessionCookie.split(';')[0]);
  res = createRes();
  logout(req, res);
  await res.wait();
  assert.strictEqual(res.statusCode, 200);
  const cleared = res.headers['Set-Cookie'];
  assert(Array.isArray(cleared) && cleared.some((v) => v.startsWith('ym_session=')));

  console.log('auth-backend pass');
})();
