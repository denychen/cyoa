'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Stories', [
      { id: '70d803bd-a47c-47fb-9c5a-2212ca08fdef', title: 'Story 1', description: 'Description 1', firstPageId: null, published: true, firstPublishedAt: Sequelize.literal('NOW(3)') },
      { id: 'd7482ea5-6800-4414-88bc-1c9651eedf0e', title: 'Story 2', description: '', firstPageId: null, published: false }
    ], {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Stories', null, {});
  }
};
