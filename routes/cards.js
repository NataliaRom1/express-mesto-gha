const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCardById,
  addCardLike,
  deleteCardLike,
} = require('../controllers/cards');

router.get('/cards', getCards);
router.post('/cards', createCard);
router.delete('/cards/:cardId', deleteCardById);
router.put('/cards/:cardId/likes', addCardLike);
router.delete('/cards/:cardId/likes', deleteCardLike);

module.exports = router;
