module.exports = class AppError extends Error {
  constructor(message, status) {
    let errorMessage = {
      errors: [
        {
          detail: message
        }
      ]
    };

    super(JSON.stringify(errorMessage));

    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);

    this.status = status || 500;
  }
};