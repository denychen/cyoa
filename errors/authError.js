module.exports = class AuthError extends require('./appError') {
  constructor (message) {
    super(message || 'Not authorized to perform specified action', 401);
  }
}