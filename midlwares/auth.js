const jwt = require('jsonwebtoken');
const UnauthorizedError = require('./errors/UnauthorizedError');
// Мидлвара это функция которая будет вызываться на каждый запрос

const auth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return next(new UnauthorizedError('Need authentication'));
  }

  let payload; // Полезная нагрузка (чем мы нагрузили наш запрос)

  try {
    // payload = jwt.verify(token, process.env['JWT_SECRET']);
    payload = jwt.verify(token, 'SECRET');
  } catch (err) {
    return next(new UnauthorizedError('Need authentication'));
  }

  req.user = payload;
  return next();
};

module.exports = auth;
