const { json, cookieOptions, SESSION_COOKIE } = require('./_util');

module.exports = (req, res) => {
  res.setHeader('Set-Cookie', [
    `${SESSION_COOKIE}=; ${cookieOptions(0)}`,
    `ym_role=; ${cookieOptions(0)}`
  ]);
  json(res, 200, { ok: true, role: '' });
};
