const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001', 'https://api.movies.explorer.nomoredomainswork.ru/', 'https://movies.explorer.nomoredomainswork.ru/'],
  credentials: true,
};

module.exports = corsOptions;
