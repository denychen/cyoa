'use strict';

var models = require('../models');

module.exports = function(sequelize, DataTypes) {
  var GenreStory = sequelize.define('GenreStory', {
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
      associate: (models) => {
      }
    }
  });
  return GenreStory;
};
