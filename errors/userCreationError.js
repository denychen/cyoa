module.exports = class UserCreationError extends require('./appError') {
  constructor (message) {
    super(message || 'Failed to create user', 400);
  }
}