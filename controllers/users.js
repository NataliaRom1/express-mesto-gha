const bcrypt = require('bcryptjs'); // Библиотека для хэширования
const jsonWebToken = require('jsonwebtoken'); // Библиотека для создания токена
const User = require('../models/user'); // Экспорт модели юзера
const { STATUS_OK, STATUS_CREATED } = require('../utils/status');
const NotFoundError = require('../midlwares/errors/NotFoundError');
const BadRequestError = require('../midlwares/errors/BadRequestError');
const ConflictError = require('../midlwares/errors/ConflictError');
const UnauthorizedError = require('../midlwares/errors/UnauthorizedError');

// Возвращает всех пользователей
const getUsers = async (req, res, next) => {
  // Пытается сделать try, если не получилось - проваливается в catch
  try {
    const users = await User.find({}); // Будет ждать ответ, только потом перейдет дальше
    res.status(STATUS_OK).send({ data: users });
  } catch (err) {
    next(err);
  }
};

// Возвращает информацию о текущем пользователе
const getUserInfo = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.status(STATUS_OK).send({ data: user });
    }

    throw new NotFoundError('User not found');
  } catch (err) {
    next(err);
  }
};

// getUsers - это контролер
// res, req, next*, error* - параметры (если есть next - это мидлвара, если error - errorHandler
// или error мидлвара)

//   // req - все из объекта запроса
//   // res - все из ответа(обычно методы)
//   // next - передаем дальше

//   User.find({}) // Возвращаем всех пользователей из БД; метод ассинхронный, он возвращает промис

// Возвращает пользователя по _id
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (user) {
      res.status(STATUS_OK).send({ data: user });
    }
    throw new NotFoundError('User not found');
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Data is incorrect'));
    } else {
      next(err);
    }
  }
};

// Создаёт пользователя 14 спринт
const createUser = async (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  try {
    // Соль - уникальное значение для нашего ресурса
    const hashedPassword = await bcrypt.hash(String(password), 10);
    const user = await User
      .create({
        name,
        about,
        avatar,
        email,
        password: hashedPassword,
      });
    // При успешном создании нового чего-то принято использовать статус 201
    res.status(STATUS_CREATED).send({ data: user });
  } catch (err) {
    if (err instanceof ValidationError) {
      next(new BadRequestError('Data is incorrect'));
    } else if (err.code === 11000) {
      next(new ConflictError('User with this email already exists'));
    } else {
      next(err);
    }
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }) // Проверяем, существует ли юзер с таким емейлом
      .select('+password'); // Добавили поле пароль, т.к. оно скрыто
    if (user) {
      const isValidUser = await bcrypt.compare(String(password), user.password);
      if (isValidUser) {
        // Создать JWT
        const jwt = jsonWebToken.sign({
          _id: user._id,
        }, process.env['JWT_SECRET']); // Второй параметр - "секрет", который делает наш токен уникальным
        // Прикрепить jwt к куке
        res.cookie('jwt', jwt, {
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
          httpOnly: true, // Кука доступна только в рамках http запроса
          // (нельзя получить доступ ч / з js)
          sameSite: true, // Позволяет отправлять куки только в рамках одного домена
          secure: true, // Чтобы кука уходила только по https соединению
        });
        res.status(STATUS_OK).send({ data: user.toJSON() });
      } else {
        throw new UnauthorizedError('Incorrect password or email');
      }
    }
    throw new UnauthorizedError('Incorrect password or email');
  } catch (err) {
    if (err instanceof ValidationError) {
      next(new BadRequestError('Data is incorrect'));
    } else {
      next(err);
    }
  }
};

// Обновляет профиль
const updateProfile = async (req, res, next) => {
  const { name, about } = req.body;

  try {
    const user = await User.updateOne(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    );
    if (user) {
      res.status(STATUS_OK).send(user);
    }
    throw new NotFoundError('User not found');
  } catch (err) {
    if (err instanceof ValidationError) {
      next(new BadRequestError('Data is incorrect'));
    } else {
      next(err);
    }
  }
};

// Обновляет аватар
const updateAvatar = async (req, res, next) => {
  const { avatar } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    );

    if (user) {
      res.status(STATUS_OK).send(user);
    }

    throw new NotFoundError('User not found');
  } catch (err) {
    if (err instanceof ValidationError) {
      next(new BadRequestError('Data is incorrect'));
    } else {
      next(err);
    }
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  login,
  updateProfile,
  updateAvatar,
  getUserInfo,
};
