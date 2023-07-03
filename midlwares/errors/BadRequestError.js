class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.name = 'BadRequestError';
    this.message = message;
    this.statusCode = 400;
  }
}

module.exports = BadRequestError;
