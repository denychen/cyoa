'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'Pages', 
      'name', 
      { 
        type: Sequelize.STRING, 
        unique: false
      });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('Pages', 'name');
  }
};
