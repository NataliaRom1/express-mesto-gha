const router = require('express').Router();
const { getCards, createCard, deleteCardById, addCardLike, deleteCardLike } = require('../controllers/cards')

router.get('/cards', getCards);
router.post('/cards', createCard);
router.delete('/cards/:cardId', deleteCardById);

router.patch('/cards/:cardId/likes', addCardLike);
router.patch('/cards/:cardId/like', deleteCardLike);

module.exports = router;