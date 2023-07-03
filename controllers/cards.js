const Card = require('../models/card'); // Экспорт модели карточки
const { STATUS_OK, STATUS_CREATED } = require('../utils/status');
const NotFoundError = require('../midlwares/errors/NotFoundError');
const BadRequestError = require('../midlwares/errors/BadRequestError');
const ForbiddenError = require('../midlwares/errors/ForbiddenError');

// Возвращает все карточки
const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res.status(STATUS_OK).send(cards);
  } catch (err) {
    next(err);
  }
};

// Создаёт карточку
const createCard = async (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  try {
    const card = await Card.create({ name, link, owner });
    res.status(STATUS_CREATED).send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Data is incorrect'));
    } else {
      next(err);
    }
  }
};

// Удаляет карточку по идентификатору
const deleteCardById = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndDelete(req.params.cardId)
      .orFail(() => new Error('Not found'));

    if (card.owner.toString() !== req.user._id) {
      throw new ForbiddenError('You do not have access rights');
    }

    res.status(STATUS_OK).send(card);
  } catch (err) {
    if (err.message === 'Not found') {
      next(new NotFoundError('Card not found'));
    } else if (err.name === 'CastError') {
      next(new BadRequestError('Data is incorrect'));
    } else {
      next(err);
    }
  }
};

// Поставить лайк карточке
const addCardLike = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    )
      .orFail(new Error('Not found'));
    res.status(STATUS_OK).send(card);
  } catch (err) {
    if (err.message === 'Not found') {
      next(new NotFoundError('Card not found'));
    } else if (err.name === 'CastError') {
      next(new BadRequestError('Data is incorrect'));
    } else {
      next(err);
    }
  }
};

// Удалить лайк карточке
const deleteCardLike = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    )
      .orFail(new Error('Not found'));
    res.status(STATUS_OK).send(card);
  } catch (err) {
    if (err.message === 'Not found') {
      next(new NotFoundError('Card not found'));
    } else if (err.name === 'CastError') {
      next(new BadRequestError('Data is incorrect'));
    } else {
      next(err);
    }
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  addCardLike,
  deleteCardLike,
};
