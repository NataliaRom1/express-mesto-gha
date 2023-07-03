class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnauthorizedError';
    this.message = message;
    this.statusCode = 401;
  }
}

module.exports = UnauthorizedError;
