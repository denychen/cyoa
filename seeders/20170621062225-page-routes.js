'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('PageRoutes', [
      { id: '2b268cf9-5a72-49d7-bf1b-127a150f047a', originId: '1080f223-a9a0-482d-9a68-133998bef225', destinationId: '4ad8876a-63d1-4293-a602-9ddd676bae48' },
      { id: '90565345-42ef-43cd-8d7e-cb9750ba53ac', originId: '4ad8876a-63d1-4293-a602-9ddd676bae48', destinationId: '8ba6dada-f3af-4633-9ea7-70607ce6e51d' },
      { id: '0461df07-e785-46e0-a13c-db2f1b144098', originId: '4ad8876a-63d1-4293-a602-9ddd676bae48', destinationId: '4ada7d0a-490e-4211-ab00-41d0d9a9edc2' },
      { id: '95416ba0-72b0-4db7-a0f9-783c37c24cf8', originId: '8ba6dada-f3af-4633-9ea7-70607ce6e51d', destinationId: '4ada7d0a-490e-4211-ab00-41d0d9a9edc2' },
    ], {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('PageRoutes', null, {});
  }
};
