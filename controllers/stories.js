'use strict';

const Story = require('../models').Story;
const Genre = require('../models').Genre;

module.exports = {
  findAll() {
    return Story.findAll().then(stories => {
      return stories.map(story => {
        return {
          id: story.id,
          title: story.title,
          description: story.description,
          createdAt: story.createdAt
        };
      });
    });
  },

  findById(id) {
    return Story.find({
      include: [{
        model: Genre,
      }],
      where: { id: id }
    }).then(story => {
      let genres = story.Genres.map(genre => {
        return genre.genre;
      });

      return {
        id: story.id,
        title: story.title,
        description: story.description,
        firstPageId: story.firstPageId,
        genres: genres
      }
    });
  }
};