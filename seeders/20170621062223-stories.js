'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Stories', [
      { id: '70d803bd-a47c-47fb-9c5a-2212ca08fdef', title: 'Title', firstPageId: null }
    ], {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Stories', null, {});
  }
};
