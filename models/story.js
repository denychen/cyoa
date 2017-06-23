'use strict';
module.exports = function(sequelize, DataTypes) {
  var Story = sequelize.define('Story', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    title: DataTypes.TEXT,
    firstPageId: DataTypes.UUID,
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('NOW()')
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('NOW()')
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
      }
    }
  });
  return Story;
};
