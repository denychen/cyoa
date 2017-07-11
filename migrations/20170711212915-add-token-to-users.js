'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'Users', 
      'token', 
      { 
        type: Sequelize.STRING, 
        unique: true
      });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('Users', 'token');
  }
};
