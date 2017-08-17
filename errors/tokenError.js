module.exports = class TokenError extends require('./appError') {
  constructor (message, status) {
    super(message || 'There is an error with the token', status || 400);
  }
}