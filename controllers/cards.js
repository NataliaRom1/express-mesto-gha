const Card = require('../models/card'); // Экспорт модели карточки
const { ERROR_BAD_REQUEST, ERROR_NOT_FOUND, ERROR_INTERNAL_SERVER } = require('../utils/errors');
const { STATUS_OK, STATUS_CREATED } = require('../utils/status');

// Возвращает все карточки
const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(STATUS_OK).send(cards))
    .catch((err) => res
      .status(ERROR_INTERNAL_SERVER)
      .send({
        message: 'Internal server error',
        err: err.message,
        stack: err.stack,
      }));
};

// Создаёт карточку
const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(STATUS_CREATED).send(card))
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

// Удаляет карточку по идентификатору
const deleteCardById = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .orFail(() => new Error('Not found'))
    .then((card) => res.status(STATUS_OK).send(card))
    .catch((err) => {
      if (err.message === 'Not found') {
        res
          .status(ERROR_NOT_FOUND)
          .send({
            message: 'Card not found',
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
            message: 'Internal Server Error',
            err: err.message,
            stack: err.stack,
          });
      }
    });
};

// Поставить лайк карточке
const addCardLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(new Error('Not found'))
    .then((card) => res.status(STATUS_OK).send(card))
    .catch((err) => {
      if (err.message === 'Not found') {
        res
          .status(ERROR_NOT_FOUND)
          .send({
            message: 'Card not found',
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
            message: 'Internal Server Error',
            err: err.message,
            stack: err.stack,
          });
      }
    });
};

// Удалить лайк карточке
const deleteCardLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(new Error('Not found'))
    .then((card) => res.status(STATUS_OK).send(card))
    .catch((err) => {
      if (err.message === 'Not found') {
        res
          .status(ERROR_NOT_FOUND)
          .send({
            message: 'Card not found',
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

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  addCardLike,
  deleteCardLike,
};
