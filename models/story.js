'use strict';
module.exports = function(sequelize, DataTypes) {
  var Story = sequelize.define('Story', {
    title: DataTypes.TEXT,
    firstPageId: DataTypes.INTEGER,
  }, {
    classMethods: {
      associate: function(models) {
        Story.hasOne(models.Page)
      }
    }
  });
  return Story;
};
