const mongoose = require('mongoose');
const validator = require('validator');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },

  link: {
    type: String,
    required: true,
    validate: {
      validator: (url) => validator.isURL(url),
      message: 'Invalid URL',
    },
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },

  likes: [// Cписок лайкнувших пост пользователей
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      default: [],
    },
  ],

  createdAt: { // Дата создания
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
