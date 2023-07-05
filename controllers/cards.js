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
    if (err instanceof BadRequestError) {
      next(new BadRequestError('Data is incorrect'));
    } else {
      next(err);
    }
  }
};

// Удаляет карточку по идентификатору
const deleteCardById = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.cardId);

    if (!card) {
      throw new NotFoundError('Card not found');
    } else if (card.owner.toString() === req.user._id) {
      await Card.deleteOne(card);
      res.status(STATUS_OK).send({ data: card });
    } else {
      throw new ForbiddenError('You do not have access rights');
    }
  } catch (err) {
    if (err.name === 'CastError') {
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
    );

    if (card) {
      res.status(STATUS_OK).send(card);
    }
    throw new NotFoundError('Card not found');
  } catch (err) {
    if (err.name === 'CastError') {
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
    );

    if (card) {
      res.status(STATUS_OK).send(card);
    }
    throw new NotFoundError('Card not found');
  } catch (err) {
    if (err.name === 'CastError') {
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
