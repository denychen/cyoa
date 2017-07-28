'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.changeColumn(
      'Stories',
      'firstPageId',
      {
        type: Sequelize.UUID,
        references: {
          model: 'Pages',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'set null'
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.changeColumn(
      'Stories',
      'firstPageId',
      {
        type: Sequelize.UUID
      }
    )
  }
};
