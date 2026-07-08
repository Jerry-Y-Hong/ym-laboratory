const { parseCookies, json, verifySessionToken, SESSION_COOKIE } = require('./_util');

module.exports = (req, res) => {
  const cookies = parseCookies(req.headers.cookie || '');
  const role = verifySessionToken(cookies[SESSION_COOKIE] || '');
  json(res, 200, { ok: true, role });
};
