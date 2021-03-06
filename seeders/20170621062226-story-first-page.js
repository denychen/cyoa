'use strict';

var models = require('../models');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return models.Story.findAll({ limit: 1 }).each(story => {
      story.firstPageId = '1080f223-a9a0-482d-9a68-133998bef225';
      return story.save();
    });
  },

  down: function (queryInterface, Sequelize) {
    return models.Story.findAll().each(story => {
      story.firstPageId = null;
      return story.save();
    });
  }
};
