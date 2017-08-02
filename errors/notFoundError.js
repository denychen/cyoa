module.exports = class NotFoundError extends require('./appError') {
  constructor (message, status) {
    super(message || 'Unable to find resource', status || 401);
  }
}