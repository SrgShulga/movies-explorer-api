const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;
const { CastError, ValidationError } = mongoose.Error;
const { SUCCESS_CREATED, DUPLICATE_OBJECT } = require('../utils/responseStatus');
const NotFound = require('../utils/response-error/NotFound');
const RequestConflict = require('../utils/response-error/RequestConflict');
const BadRequest = require('../utils/response-error/BadRequest');

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  const passwordHash = bcrypt.hash(password, 10);
  passwordHash.then((hash) => User.create({
    name, email, password: hash,
  }))
    .then((selectedUser) => res.status(SUCCESS_CREATED).send({
      name: selectedUser.name,
      email: selectedUser.email,
    }))
    .catch((error) => {
      if (error instanceof ValidationError) next(new BadRequest('Переданы некорректные данные при создании пользователя'));
      else if (error.code === DUPLICATE_OBJECT) next(new RequestConflict('Пользователь с указанной почтой уже есть в системе'));
      else next(error);
    });
};

const loginUser = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((selectedUser) => {
      const userToken = jwt.sign({ _id: selectedUser._id }, NODE_ENV === 'production' ? JWT_SECRET : 'jwt-secret-diploma', { expiresIn: '7d' });
      res.send({ userToken });
    })
    .catch(next);
};

const getUserId = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => next(new NotFound('Пользователь по указанному ID не найден')))
    .then((selectedUser) => res.send(selectedUser))
    .catch((error) => {
      if (error instanceof CastError) next(new BadRequest('Некорректный _id запрашиваемого пользователя'));
      else next(error);
    });
};

const updateUserData = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, {
    new: true,
    runValidators: true,
  })
    .orFail(() => next(new NotFound('Пользователь по указанному _id не найден')))
    .then((updatedData) => res.send(updatedData))
    .catch((error) => {
      if (error instanceof ValidationError) next(new BadRequest('Переданы некорректные данные при обновлении пользователя'));
      else next(error);
    });
};

module.exports = {
  createUser, loginUser, getUserId, updateUserData,
};
