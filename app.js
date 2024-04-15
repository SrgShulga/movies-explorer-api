require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { errors } = require('celebrate');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const mainRouter = require('./routes/index');
const corsConfig = require('./utils/corsConfig');
const errorHandler = require('./middlewares/errorHandler');
const limiter = require('./middlewares/limiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT, MONGO_URL, API_ADDRESS } = process.env;

const app = express();

mongoose.set('strictQuery', false);
mongoose.connect(MONGO_URL);

app.use(requestLogger);
app.use(limiter);
app.use('*', cors(corsConfig));
app.use(bodyParser.json());
app.use(helmet());
app.use('/', mainRouter);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Сервер успешо запущен - ${API_ADDRESS}`);
});
