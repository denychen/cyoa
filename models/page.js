'use strict';

var models = require('../models');

module.exports = function(sequelize, DataTypes) {
  let Page = sequelize.define('Page', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    storyId: {
      type: DataTypes.UUID,
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
    classMethods: {
      associate: (models) => {
        Page.belongsTo(models.Story, {
          foreignKey: 'storyId'
        });
        Page.belongsToMany(models.Page, { 
          as: 'origins',
          through: {
            model: models.PageRoute,
            unique: false
          },
          foreignKey: 'destinationId',
          otherKey: 'originId'
        });
        Page.belongsToMany(models.Page, { 
          as: 'destinations',
          through: {
            model: models.PageRoute,
            unique: false
          },
          foreignKey: 'originId',
          otherKey: 'destinationId'
        });
      }
    }
  });
  return Page;
};
