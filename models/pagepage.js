'use strict';
module.exports = function(sequelize, DataTypes) {
  var PagePage = sequelize.define('PagePage', {
    originId: DataTypes.INTEGER,
    destinationId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        PagePage.belongsToMany(models.Page, {
          through: [models.Page],
          foreignKey: 'originId'
        });
        PagePage.belongsToMany(models.Page, {
          through: [models.Page],
          foreignKey: 'destinationId'
        });
      }
    }
  });
  return PagePage;
};
