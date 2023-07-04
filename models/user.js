const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: { // Опишем требования к имя пользователя в схеме:
    type: String, // имя — это строка
    default: 'Жак',
    minlength: 2, // минимальная длина имени — 2 символа
    maxlength: 30, // а максимальная — 30 символов
  },

  about: {
    type: String,
    default: 'Исследователь',
    minlength: 3,
    maxlength: 30,
  },

  avatar: {
    type: String, // Ссылка на аватарку
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (url) => validator.isURL(url),
      message: 'Invalid URL',
    },
  },

  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: 'Invalid email',
    },
  },

  password: {
    type: String,
    select: false, // Убираем пароль из вывода
    required: true,
  },
});

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;

  return user;
};

module.exports = mongoose.model('user', userSchema);
