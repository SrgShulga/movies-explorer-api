const movieRouter = require('express').Router();

const { getMovieList, addMovie, deleteMovie } = require('../controllers/movies');
const { validateMovieId, validateAddMovie } = require('../utils/dataValidation');

movieRouter.get('/', getMovieList);
movieRouter.post('/', validateAddMovie, addMovie);
movieRouter.delete('/:movieId', validateMovieId, deleteMovie);

module.exports = movieRouter;
