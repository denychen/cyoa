'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', [
      { id: '99c039b3-1755-40dd-b85b-4a101dd71dea', username: 'denychen', email: 'deny.chen@gmail.com', password: '$2a$10$Ng9jKBHU.ecbAwIFGSsKGeUEorimqBseCxMzamzFL8hQkt9yHNkna' },
    ], {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
