const mainRouter = require('express').Router();

const { loginUser, createUser } = require('../controllers/users');
const { validateUserLogin, validateUserRegister } = require('../utils/dataValidation');
const authGuard = require('../middlewares/auth');
const userRouter = require('./users');
const movieRouter = require('./movies');

const NotFound = require('../utils/response-error/NotFound');

mainRouter.post('/signup', validateUserRegister, createUser);
mainRouter.post('/signin', validateUserLogin, loginUser);

mainRouter.use(authGuard);
mainRouter.use('/users', userRouter);
mainRouter.use('/movies', movieRouter);

mainRouter.use('*', (req, res, next) => {
  next(new NotFound('Запрашиваемая страница не найдена'));
});

module.exports = mainRouter;
