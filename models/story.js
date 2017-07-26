'use strict';
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
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('NOW()'),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('NOW()'),
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
