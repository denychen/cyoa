'use strict';

var models = require('../models');

module.exports = function(sequelize, DataTypes) {
  var GenreStory = sequelize.define('GenreStory', {
    genreId: {
      type: DataTypes.INTEGER,
      references: {
        model: models.Genre,
        key: 'id'
      },
      validate: {
        notEmpty: true,
        isInt: true
      }
    },
    storyId: {
      type: DataTypes.UUID,
      references: {
        model: models.Story,
        key: 'id'
      },
      validate: {
        notEmpty: true,
        isUUID: 4
      }
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
      associate: (models) => {
      }
    }
  });
  return GenreStory;
};
