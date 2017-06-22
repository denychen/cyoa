'use strict';

var models = require('../models');

module.exports = function(sequelize, DataTypes) {
  var PageRoute = sequelize.define('PageRoute', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    originId: {
      type: DataTypes.UUID,
      references: {
        model: models.Page,
        key: 'id'
      }
    },
    destinationId: {
      type: DataTypes.UUID,
      references: {
        model: models.Page,
        key: 'id'
      }
    },
    option: DataTypes.STRING,
    order: DataTypes.INTEGER,
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
