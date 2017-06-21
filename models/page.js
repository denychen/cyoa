'use strict';

var models = require('../models');

module.exports = function(sequelize, DataTypes) {
  let Page = sequelize.define('Page', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      foreignKey: null
    },
    storyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: models.Story,
        key: 'id'
      }
    },
    content: DataTypes.TEXT,
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
      associate: (models) => {
        Page.belongsTo(models.Story, {
          foreignKey: 'storyId'
        });
        Page.belongsToMany(models.PageRoute, { 
          as: 'origin',
          through: {
            model: models.PageRoute,
            unique: false
          },
          otherKey: 'id',
          foreignKey: 'originId'
        });
        Page.belongsToMany(models.PageRoute, { 
          as: 'destination',
          through: {
            model: models.PageRoute,
            unique: false
          },
          otherKey: 'id',
          foreignKey: 'destinationId'
        });
      }
    }
  });
  return Page;
};
