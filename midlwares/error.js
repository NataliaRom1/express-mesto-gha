const errorHandler = (err, req, res, next) => {
  res
    .status(500)
    .send({ message: 'Error has occurred on server' });
  next();
};

module.exports = errorHandler;
