'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('PageRoutes', [
      { id: 1, originId: 1, destinationId: 2 },
      { id: 2, originId: 2, destinationId: 3 },
      { id: 3, originId: 2, destinationId: 4 },
      { id: 4, originId: 3, destinationId: 4 },
    ], {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('PageRoutes', null, {});
  }
};
