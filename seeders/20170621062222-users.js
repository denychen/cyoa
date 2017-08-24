'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', [
      { id: '99c039b3-1755-40dd-b85b-4a101dd71dea', username: 'denychen', email: 'deny.chen@gmail.com', password: '$2a$10$6V5DXAb0L/ysSXA7d3DceuSA7VrJYBl3TJryZgdhfPKzBRQyki9KW' },
    ], {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
