const { json, cookieOptions, accessCodes, sessionSecret, createSessionToken, SESSION_COOKIE } = require('./_util');

module.exports = (req, res) => {
  if (req.method !== 'POST') {
    return json(res, 405, { ok: false, message: 'Method not allowed' });
  }

  const chunks = [];
  req.on('data', chunk => chunks.push(chunk));
  req.on('end', () => {
    let body = {};
    try {
      body = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
    } catch (e) {
      return json(res, 400, { ok: false, message: 'Invalid JSON body' });
    }

    const role = body.role === 'admin' ? 'admin' : body.role === 'expert' ? 'expert' : '';
    const code = String(body.code || '').trim();
    const codes = accessCodes();

    if (!role) return json(res, 400, { ok: false, message: 'Invalid role' });
    if (!codes[role]) return json(res, 503, { ok: false, message: 'Access code is not configured on the server.' });
    if (!sessionSecret()) return json(res, 503, { ok: false, message: 'Session secret is not configured on the server.' });
    if (code !== codes[role]) return json(res, 401, { ok: false, message: '접근 코드가 올바르지 않습니다.' });

    const token = createSessionToken(role);
    if (!token) return json(res, 503, { ok: false, message: 'Failed to create authenticated session.' });

    res.setHeader('Set-Cookie', [
      `${SESSION_COOKIE}=${token}; ${cookieOptions()}`,
      `ym_role=; ${cookieOptions(0)}`
    ]);
    return json(res, 200, { ok: true, role });
  });
};
