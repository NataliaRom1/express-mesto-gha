const express = require('express'); // Экспорт express
const mongoose = require('mongoose');
const router = require('./routes');

const app = express(); // Создаем сервер - вызовом экспресс

// подключаемся к серверу mongo mongodb://localhost:27017/mestodb
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.json());

// Мидлвара добавляет в каждый запрос объект user
app.use((req, res, next) => {
  req.user = {
    _id: '64904d3ee6bd45ff319040d8',
  };

  next();
});

app.use(router);

// Слушаю порт 3001 и передаю колбек, котрый он вызовет в момент, когда начнет слушать.
app.listen(3001, () => {
  console.log('Слушаю порт 3001');
});
