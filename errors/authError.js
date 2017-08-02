module.exports = class AuthError extends require('./appError') {
  constructor (message, status) {
    super(message || 'Not authorized to perform specified action', status || 401);
  }
}