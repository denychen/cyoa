'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'Stories',
      'firstPublishedAt',
      {
        type: Sequelize.DATE(3),
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('Stories', 'firstPublishedAt');
  }
};
