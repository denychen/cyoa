'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('PageRoutes', [
      { option: 'Option 1', order: 1, originId: '1080f223-a9a0-482d-9a68-133998bef225', destinationId: '4ad8876a-63d1-4293-a602-9ddd676bae48' },
      { option: 'Option 1', order: 1, originId: '4ad8876a-63d1-4293-a602-9ddd676bae48', destinationId: '8ba6dada-f3af-4633-9ea7-70607ce6e51d' },
      { option: 'Option 2', order: 2, originId: '4ad8876a-63d1-4293-a602-9ddd676bae48', destinationId: '4ada7d0a-490e-4211-ab00-41d0d9a9edc2' },
      { option: 'Option 1', order: 1, originId: '8ba6dada-f3af-4633-9ea7-70607ce6e51d', destinationId: '4ada7d0a-490e-4211-ab00-41d0d9a9edc2' },
    ], {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('PageRoutes', null, {});
  }
};
