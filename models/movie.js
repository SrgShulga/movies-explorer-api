const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    validate: { validator: (correct) => validator.isURL(correct), message: 'Ошибка валидации постера' },
    required: true,
  },
  trailerLink: {
    type: String,
    validate: { validator: (correct) => validator.isURL(correct), message: 'Ошибка валидации ссылки трейлера' },
    required: true,
  },
  thumbnail: {
    type: String,
    validate: { validator: (correct) => validator.isURL(correct), message: 'Ошибка валидации миниатюрного постера' },
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: 'true',
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    require: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
