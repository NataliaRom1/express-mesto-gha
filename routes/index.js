const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const { ERROR_NOT_FOUND } = require('../utils/errors');

router.use(userRoutes); // '/users'
router.use(cardRoutes); // '/cards'
router.use('/*', (req, res) => {
  res.status(ERROR_NOT_FOUND).send({ message: 'Page not found' });
});

module.exports = router;
