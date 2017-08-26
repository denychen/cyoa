'use strict';
module.exports = function(sequelize, DataTypes) {
  var Genre = sequelize.define('Genre', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
      validate: {
        notEmpty: true,
        isInt: true
      }
    },
    genre: {
      type: DataTypes.STRING,
      allowNull: false
    },
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
