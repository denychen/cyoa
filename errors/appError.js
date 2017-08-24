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
    this.logError(message);

    this.status = status || 500;
  };

  logError(message) {
    let asterisks = Array(message.length + 19).fill('*').join("");
    console.error(`\n${asterisks}\n***** ERROR: ${message} *****\n${asterisks}\n`);
  };
};