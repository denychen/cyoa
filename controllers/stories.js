'use strict';

const Story = require('../models').Story;

module.exports = {
  findAll() {
    return Story.findAll().then(stories => {
      return stories.map(story => {
        return {
          id: story.id,
          firstPageId: story.firstPageId,
          title: story.title
        }
      });
    });
  }
};