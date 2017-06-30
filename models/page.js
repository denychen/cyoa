'use strict';

var models = require('../models');

module.exports = function(sequelize, DataTypes) {
  let Page = sequelize.define('Page', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      validate: {
        notEmpty: true,
        isUUID: 4
      }
    },
    storyId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: models.Story,
        key: 'id'
      },
      validate: {
        notEmpty: true,
        isUUID: 4
      }
    },
    content: DataTypes.TEXT,
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
