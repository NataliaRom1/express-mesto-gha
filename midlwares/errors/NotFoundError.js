class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.message = message;
    this.statusCode = 404;
  }
}

module.exports = NotFoundError;
