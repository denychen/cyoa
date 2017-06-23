'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Genres', [
      { id: '1', genre: 'Mystery' },
      { id: '2', genre: 'Science Fiction' }
    ], {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Genres', null, {});
  }
};
