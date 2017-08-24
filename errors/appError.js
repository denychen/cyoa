let moment = require('moment');

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
    let currentTime = moment().toString();
    let messageLonger = message.length > currentTime.length;

    let asterisks = Array(Math.max(message.length + 7, currentTime.length) + 12).fill('*').join("").concat('\n');
    let fillAsterisks = Array(Math.abs((message.length + 7) - currentTime.length) + 5).fill('*').join("").concat('\n');
    let errorMessage = asterisks.concat(`***** ${currentTime} ${messageLonger ? fillAsterisks : '*****\n'}`).concat(`***** ERROR: ${message} ${messageLonger ? '*****\n' : fillAsterisks}`).concat(asterisks);
    console.error(`\n${errorMessage}`);
  };
};