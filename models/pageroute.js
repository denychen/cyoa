'use strict';

var models = require('../models');

module.exports = function(sequelize, DataTypes) {
  var PageRoute = sequelize.define('PageRoute', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    originId: {
      type: DataTypes.INTEGER,
      references: {
        model: models.Page,
        key: 'id'
      }
    },
    destinationId: {
      type: DataTypes.INTEGER,
      references: {
        model: models.Page,
        key: 'id'
      }
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
    timestamps: true,
    classMethods: {
      associate: function(models) {
        PageRoute.hasMany(models.Page, { 
          as: 'origin',
          constraints: false,
          foreignKey: 'id',
          sourceKey: 'originId'
        });
        PageRoute.hasMany(models.Page, { 
          as: 'destination',
          constraints: false,
          foreignKey: 'id',
          sourceKey: 'destinationId'
        });
      }
    }
  });
  return PageRoute;
};
