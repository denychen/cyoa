'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Pages', [
      { id: 1, storyId: 1, content: 'Content 1' },
      { id: 2, storyId: 1, content: 'Content 2' },
      { id: 3, storyId: 1, content: 'Content 3' },
      { id: 4, storyId: 1, content: 'Content 4' },
    ], {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Pages', null, {});
  }
};
