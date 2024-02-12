require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { errors } = require('celebrate');
const helmet = require('helmet');
const mainRouter = require('./routes/index');
const corsConfig = require('./utils/corsConfig');
const responseHandler = require('./middlewares/errorHandler');
const limiter = require('./middlewares/limiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT, MONGO_URL, API_ADDRESS } = process.env;

const app = express();

mongoose.set('strictQuery', false);
mongoose.connect(MONGO_URL);

app.use('*', cors(corsConfig));
app.use(requestLogger);
app.use(limiter);
app.use(helmet());
app.use(express.json());
app.use(errorLogger);
app.use(errors());
app.use(responseHandler);

app.use('/', mainRouter);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Сервер успешо запущен - ${API_ADDRESS}`);
});
