'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('GenreStories', [
      { genreId: '1', storyId: '70d803bd-a47c-47fb-9c5a-2212ca08fdef' },
      { genreId: '2', storyId: '70d803bd-a47c-47fb-9c5a-2212ca08fdef' },
      { genreId: '1', storyId: 'd7482ea5-6800-4414-88bc-1c9651eedf0e' }
    ], {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('GenreStories', null, {});
  }
};
