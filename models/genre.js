'use strict';
module.exports = function(sequelize, DataTypes) {
  var Genre = sequelize.define('Genre', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    genre: {
      type: DataTypes.STRING,
      allowNull: false
    },
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
        Genre.belongsToMany(models.Story, { 
          through: 'GenreStory',
          foreignKey: 'genreId',
          otherKey: 'storyId'
        });
      }
    }
  });
  return Genre;
};
