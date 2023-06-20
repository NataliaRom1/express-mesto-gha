const User = require('../models/user'); // Экспорт модели юзера
const { ERROR_BAD_REQUEST, ERROR_NOT_FOUND, ERROR_INTERNAL_SERVER } = require('../utils/errors');
const { STATUS_OK, STATUS_CREATED } = require('../utils/status');

// Возвращает всех пользователей
const getUsers = async (req, res) => {
  // Пытается сделать try, если не получилось - проваливается в catch
  try {
    const users = await User.find({}); // Будет ждать ответ, только потом перейдет дальше
    res.status(STATUS_OK).send(users);
  } catch (err) {
    if (err.message.includes('validation failed')) {
      res
        .status(ERROR_BAD_REQUEST)
        .send({
          message: 'Data is incorrect',
        });
    } else {
      res
        .status(ERROR_INTERNAL_SERVER)
        .send({
          message: 'Internal Server Error',
          err: err.message,
          stack: err.stack,
        });
    }
  }
};

// getUsers - это контролер
// res, req, next*, error* - параметры (если есть next - это мидлвара, если error - errorHandler
// или error мидлвара)
// const getUsers = (req, res) => {
//   // req - все из объекта запроса
//   // res - все из ответа(обычно методы)
//   // next - передаем дальше

//   User.find({}) //Возвращаем всех пользователей из БД; метод ассинхронный, он возвращает промис
//     .then((users) => res.status(200).send(users))
//     .catch((err) => res
//       .status(500)
//       .send({
//         message: 'Internal server error',
//         err: err.message,
//         stack: err.stack
//       }));

//   console.log("Это запрос на /users");
// }

// Возвращает пользователя по _id
const getUserById = (req, res) => {
  User.findById(req.params.userId, { runValidators: true })
    .orFail(() => new Error('Not found')) // Мы попадаем сюда, когда ничего не найдено
    .then((user) => res.status(STATUS_OK).send(user))
    .catch((err) => {
      if (err.message === 'Not found') {
        res
          .status(ERROR_NOT_FOUND)
          .send({
            message: 'User not found',
          });
      } else if (err.name === 'CastError') {
        res
          .status(ERROR_BAD_REQUEST)
          .send({
            message: 'Data is incorrect',
          });
      } else {
        res
          .status(ERROR_INTERNAL_SERVER)
          .send({
            message: 'Internal server error',
            err: err.message,
            stack: err.stack,
          });
      }
    });
};

// Создаёт пользователя
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    // При успешном создании нового чего-то принято использовать статус 201
    .then((user) => res.status(STATUS_CREATED).send(user))
    .catch((err) => {
      if (err.message.includes('validation failed')) {
        res
          .status(ERROR_BAD_REQUEST)
          .send({
            message: 'Data is incorrect',
          });
      } else {
        res
          .status(ERROR_INTERNAL_SERVER)
          .send({
            message: 'Internal Server Error',
            err: err.message,
            stack: err.stack,
          });
      }
    });
};

// Обновляет профиль
const updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res
          .status(ERROR_NOT_FOUND)
          .send({
            message: 'User not found',
          });
      } else {
        res.status(STATUS_OK).send(user);
      }
    })
    .catch((err) => {
      if (err.message.includes('Validation failed')) {
        res
          .status(400)
          .send({
            message: 'Data is incorrect',
          });
      } else {
        res
          .status(ERROR_INTERNAL_SERVER)
          .send({
            message: 'Internal Server Error',
            err: err.message,
            stack: err.stack,
          });
      }
    });
};

// Обновляет аватар
const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res
          .status(ERROR_NOT_FOUND)
          .send({
            message: 'User not found',
          });
      } else {
        res.status(STATUS_OK).send(user);
      }
    })
    .catch((err) => {
      if (err.message.includes('Validation failed')) {
        res
          .status(ERROR_BAD_REQUEST)
          .send({
            message: 'Data is incorrect',
          });
      } else {
        res
          .status(ERROR_INTERNAL_SERVER)
          .send({
            message: 'Internal Server Error',
            err: err.message,
            stack: err.stack,
          });
      }
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
};
