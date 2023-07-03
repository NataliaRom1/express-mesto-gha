class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ForbiddenError';
    this.message = message;
    this.statusCode = 403;
  }
}

module.exports = ForbiddenError;
