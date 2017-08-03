'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Genres', [
      { genre: 'Action and Adventure' },
      { genre: 'Education' },
      { genre: 'Fantasy' },
      { genre: 'Horror' },
      { genre: 'Mystery' },
      { genre: 'Romance' },
      { genre: 'Science Fiction' }
    ], {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Genres', null, {});
  }
};
