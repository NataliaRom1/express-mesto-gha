const errorHandler = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'Error has occurred on server'
      : message,
  });
  next();
};

module.exports = errorHandler;
