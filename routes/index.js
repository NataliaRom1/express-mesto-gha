const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const { createUser, login } = require('../controllers/users');
const auth = require('../midlwares/auth');
const NotFoundError = require('../midlwares/errors/NotFoundError');
const urlPattern = require('../utils/constants');

router.post('/signup',
//   celebrate({
//   body: Joi.object().keys({
//     name: Joi.string().min(2).max(30),
//     about: Joi.string().min(3).max(30),
//     avatar: Joi.string().pattern(urlPattern),
//     email: Joi.string().required().email(),
//     password: Joi.string().required(),
//   }),
// }),
  createUser); // Регистрация пользователя

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login); // Аутентификация пользователя (Проверка что вы это вы)

router.use(auth);

router.use(userRoutes); // '/users'
router.use(cardRoutes); // '/cards'
router.use('/*', (req, res, next) => {
  next(new NotFoundError('Page not found'));
});

module.exports = router;
