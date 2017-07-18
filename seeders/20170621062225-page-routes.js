'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('PageRoutes', [
      { id: 'db02b41a-b102-4edb-a4a1-8a7c11bfb6ef', option: 'Pull out your shiv', order: 1, originId: '1080f223-a9a0-482d-9a68-133998bef225', destinationId: '4ad8876a-63d1-4293-a602-9ddd676bae48' },
      { id: '5f767527-6534-49a2-9e9e-cc361986572d', option: 'Drop your shiv', order: 1, originId: '4ad8876a-63d1-4293-a602-9ddd676bae48', destinationId: '8ba6dada-f3af-4633-9ea7-70607ce6e51d' },
      { id: '7b33baf9-a939-4536-9f0d-515c4396d90b', option: 'Attack with your shiv', order: 2, originId: '4ad8876a-63d1-4293-a602-9ddd676bae48', destinationId: '4ada7d0a-490e-4211-ab00-41d0d9a9edc2' },
      { id: '3764cef6-1919-4bd6-bd13-0ed3f1ac739d', option: 'Puts your arms up to block', order: 1, originId: '8ba6dada-f3af-4633-9ea7-70607ce6e51d', destinationId: '4ada7d0a-490e-4211-ab00-41d0d9a9edc2' },
    ], {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('PageRoutes', null, {});
  }
};
