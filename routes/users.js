const router = require('express').Router();
const { getUsers, getUserById, createUser, updateProfile, updateAvatar } = require('../controllers/users')

// Описываю роуты
// "/users" - эндпоинт
router.get('/users', getUsers);
// Использую динамический роут
router.get('/users/:userId', getUserById);
router.post('/users', createUser);


router.patch('/users/me', updateProfile);
router.patch('/users/me/avatar', updateAvatar);


module.exports = router;