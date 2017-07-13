'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('StoryUsers', [
      { storyId: '70d803bd-a47c-47fb-9c5a-2212ca08fdef', userId: '99c039b3-1755-40dd-b85b-4a101dd71dea' },
      { storyId: 'd7482ea5-6800-4414-88bc-1c9651eedf0e', userId: '99c039b3-1755-40dd-b85b-4a101dd71dea' },
    ], {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('StoryUsers', null, {});
  }
};
