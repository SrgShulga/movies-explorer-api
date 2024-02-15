const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const Unauthorized = require('../utils/response-error/Unauthorized');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    validate: { validator: (correct) => validator.isEmail(correct), message: 'Ошибка валидации почты' },
    required: true,
  },
  password: {
    type: String,
    select: false,
    required: true,
  },
  name: {
    type: String,
    minlength: 2,
    maxlenght: 30,
    required: true,
  },
});

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((selectedUser) => {
      if (!selectedUser) { return Promise.reject(new Unauthorized('Имя пользователя или (-и) пароль введены некорректно')); }
      return bcrypt.compare(password, selectedUser.password).then((correct) => {
        if (!correct) { return Promise.reject(new Unauthorized('Имя пользователя или (-и) пароль введены некорректно')); }
        return selectedUser;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
