'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('PageRoutes', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      originId: {
        type: Sequelize.UUID,
        references: {
          model: 'Pages',
          key: 'id'
        },
        allowNull: false,
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      destinationId: {
        type: Sequelize.UUID,
        references: {
          model: 'Pages',
          key: 'id'
        },
        allowNull: false,
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      option: {
        type: Sequelize.STRING
      },
      order: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
        allowNull: false
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('PageRoutes');
  }
};
