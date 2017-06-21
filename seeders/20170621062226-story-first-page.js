'use strict';

var models = require('../models');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return models.Story.findAll().each(story => {
      story.firstPageId = 1;
      story.save();
    });
  },

  down: function (queryInterface, Sequelize) {
    return models.Story.findAll().each(story => {
      story.firstPageId = null;
      story.save();
    });
  }
};
