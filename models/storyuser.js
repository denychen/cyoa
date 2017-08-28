'use strict';

var models = require('../models');

module.exports = function(sequelize, DataTypes) {
  var StoryUser = sequelize.define('StoryUser', {
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
    userId: {
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
      associate: (models) => {
      }
    }
  });
  return StoryUser;
};
