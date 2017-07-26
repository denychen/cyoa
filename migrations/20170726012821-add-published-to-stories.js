'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'Stories', 
      'published', 
      { 
        type: Sequelize.BOOLEAN, 
        unique: false
      });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('Stories', 'published');
  }
};
