'use strict';

var models = require('../models');

module.exports = function(sequelize, DataTypes) {
  var PageRoute = sequelize.define('PageRoute', {
    originId: {
      type: DataTypes.UUID,
      references: {
        model: models.Page,
        key: 'id'
      },
      validate: {
        notEmpty: true,
        isUUID: 4
      }
    },
    destinationId: {
      type: DataTypes.UUID,
      references: {
        model: models.Page,
        key: 'id'
      },
      validate: {
        notEmpty: true,
        isUUID: 4
      }
    },
    option: {
      type: DataTypes.STRING,
      validate: {
        notNull: true
      }
    },
    order: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: true,
        isNumeric: true
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
      associate: function(models) {
        PageRoute.hasMany(models.Page, { 
          as: 'origin',
          constraints: false,
          sourceKey: 'originId',
          foreignKey: 'id'
        });
        PageRoute.hasMany(models.Page, { 
          as: 'destination',
          constraints: false,
          sourceKey: 'destinationId',
          foreignKey: 'id'
        });
      }
    }
  });
  return PageRoute;
};
