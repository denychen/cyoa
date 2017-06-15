'use strict';
module.exports = function(sequelize, DataTypes) {
  var Page = sequelize.define('Page', {
    storyId: DataTypes.INTEGER,
    content: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        Page.belongsTo(models.Story);
      }
    }
  });
  return Page;
};
