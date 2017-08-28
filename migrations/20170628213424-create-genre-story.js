'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('GenreStories', {
      genreId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Genres',
          key: 'id'
        },
        allowNull: false,
        primaryKey: true,
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      storyId: {
        type: Sequelize.UUID,
        references: {
          model: 'Stories',
          key: 'id'
        },
        allowNull: false,
        primaryKey: true,
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      createdAt: {
        type: Sequelize.DATE(3),
        defaultValue: Sequelize.literal('NOW(3)'),
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE(3),
        defaultValue: Sequelize.literal('NOW(3)'),
        allowNull: false
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('GenreStories');
  }
};
