'use strict';

const Story = require('../models').Story;
const Genre = require('../models').Genre;
const GenreStory = require('../models').GenreStory;

module.exports = {
  create(title, description, genres) {
    let newStory = new Story({
      title: title,
      description: description
    });

    return newStory.save().then(story => {
      let newGenreStory = genres.map(genre => {
        return {
          genreId: genre.id,
          storyId: story.id
        }
      })

      return GenreStory.bulkCreate(newGenreStory);
    });
  },

  findAll() {
    return Story.findAll().then(stories => {
      return stories.map(story => {
        let shortenedDescription = story.description;
        let maxDescriptionLength = 140;

        if (shortenedDescription.length > maxDescriptionLength) {
          shortenedDescription = shortenedDescription.substring(0, maxDescriptionLength).concat('…');
        }

        return {
          id: story.id,
          title: story.title,
          description: shortenedDescription,
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