const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { // Опишем требования к имя пользователя в схеме:
    type: String, // имя — это строка
    required: true, // оно должно быть у каждого пользователя, так что имя — обязательное поле
    minlength: 2, // минимальная длина имени — 2 символа
    maxlength: 30, // а максимальная — 30 символов
  },

  about: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 30,
  },

  avatar: {
    type: String, // Ссылка на аватарку
    required: true,
  },
});

module.exports = mongoose.model('user', userSchema);
