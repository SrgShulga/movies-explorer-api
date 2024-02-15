const mongoose = require('mongoose');
const Movie = require('../models/movie');

const { SUCCESS_CREATED } = require('../utils/responseStatus');
const NotFound = require('../utils/response-error/NotFound');
const Forbidden = require('../utils/response-error/Forbidden');
const BadRequest = require('../utils/response-error/BadRequest');

const { CastError, ValidationError } = mongoose.Error;

const addMovie = (req, res, next) => {
  Movie.create({ owner: req.user._id, ...req.body })
    .then((selectedMovie) => res.status(SUCCESS_CREATED).send(selectedMovie))
    .catch((error) => {
      if (error instanceof ValidationError) next(new BadRequest('Переданы некорректные данные при добавлении фильма'));
      else next(error);
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((selectedMovie) => {
      if (!selectedMovie) { return next(new NotFound('Фильм по указанному _id не найден')); }
      if (!selectedMovie.owner.equals(req.user._id)) { return next(new Forbidden('Ошибка при удалении фильма - вы не являетесь автором')); }
      return Movie.findByIdAndDelete(req.params.movieId)
        .orFail(() => new NotFound('Фильм по указанному _id не найден'))
        .then(() => res.send({ message: 'Фильм успешно удалён' }));
    })
    .catch((error) => {
      if (error instanceof CastError) next(new BadRequest('Переданы некорректные данные фильма'));
      else next(error);
    });
};

const getMovieList = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((selectedMovie) => res.send(selectedMovie))
    .catch(next);
};

module.exports = {
  addMovie, deleteMovie, getMovieList,
};
