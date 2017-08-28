'use strict';

var models = require('../models');

module.exports = function(sequelize, DataTypes) {
  var Story = sequelize.define('Story', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      validate: {
        notEmpty: true,
        isUUID: 4
      }
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    description: DataTypes.TEXT,
    firstPageId: {
      type: DataTypes.UUID,
      references: {
        model: models.User,
        key: 'id'
      },
      validate: {
        notEmpty: true,
        isUUID: 4
      }
    },
    published: { 
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    firstPublishedAt: DataTypes.DATE(3),
    createdAt: {
      type: DataTypes.DATE(3),
      defaultValue: sequelize.literal('NOW(3)'),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    updatedAt: {
      type: DataTypes.DATE(3),
      defaultValue: sequelize.literal('NOW(3)'),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  }, {
    classMethods: {
      associate: function(models) {
        Story.belongsTo(models.Page, {
          as: 'firstPage',
          constraints: false,
          foreignKey: 'firstPageId',
          targetKey: 'id'
        });
        Story.belongsToMany(models.Genre, { 
          through: 'GenreStory',
          foreignKey: 'storyId',
          otherKey: 'genreId'
        });
        Story.belongsToMany(models.User, { 
          through: 'StoryUser',
          foreignKey: 'storyId',
          otherKey: 'userId'
        });
      }
    }
  });
  return Story;
};
