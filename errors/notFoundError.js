module.exports = class NotFoundError extends require('./appError') {
  constructor (message) {
    super(message || 'Unable to find resource', 401);
  }
}