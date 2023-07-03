require('dotenv').config();
const express = require('express'); // Экспорт express
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const router = require('./routes');
const errorHandler = require('./midlwares/error');

const { PORT = 3000 } = process.env;

// Подключаемся к серверу mongo mongodb://localhost:27017/mestodb   //127.0.0.1:27017/mestodb
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});
const app = express(); // Создаем сервер - вызовом экспресс
app.use(cookieParser());

// Чтобы req наполнился данными нужно было экспортировать и вызвать body-parser,
// НО ее добавили в сам Express
app.use(express.json());

app.use(router);
app.use(errors());
app.use(errorHandler);

// Слушаю порт 3000 и передаю колбек, котрый он вызовет в момент, когда начнет слушать.
app.listen(PORT, () => {
  console.log('Слушаю порт 3000');
});
