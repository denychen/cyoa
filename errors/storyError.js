module.exports = class AuthError extends require('./appError') {
  constructor (message, status) {
    super(message || 'There was an error creating or updating the story', status || 401);
  }
}