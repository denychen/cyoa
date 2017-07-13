'use strict';

const Sequelize = require('sequelize');
const Story = require('../models').Story;
const Genre = require('../models').Genre;
const User = require('../models').User;
const GenreStory = require('../models').GenreStory;
const StoryUser = require('../models').StoryUser;

module.exports = {
  create(title, authors, description, genres) {
    let newStory = new Story({
      title: title,
      description: description
    });

    return newStory.save().then(story => {
      let newStoryUser = new StoryUser({
        storyId: story.id,
        userId: authors
      });

      newStoryUser.save();

      let newGenreStory = genres.map(genre => {
        return {
          genreId: genre.id,
          storyId: story.id
        }
      });

      return GenreStory.bulkCreate(newGenreStory);
    });
  },

  findAll() {
    return Story.findAll({
      include: [{
        model: User
      }],
      order: [
        [Sequelize.literal('`users.StoryUser.createdAt`'), 'ASC']
      ]
    }).then(stories => {
      return stories.map(story => {
        let shortenedDescription = story.description;
        let maxDescriptionLength = 140;

        if (shortenedDescription.length > maxDescriptionLength) {
          shortenedDescription = shortenedDescription.substring(0, maxDescriptionLength).concat('…');
        }

        let authors = story.Users.map(user => {
          return user.username;
        });

        return {
          id: story.id,
          title: story.title,
          authors: authors,
          description: shortenedDescription,
          createdAt: story.createdAt
        };
      });
    });
  },

  findById(id) {
    return Story.find({
      include: [{
        model: Genre
      }, {
        model: User
      }],
      where: { id: id }
    }).then(story => {
      let genres = story.Genres.map(genre => {
        return genre.genre;
      });

      let authors = story.Users.map(user => {
        return user.username;
      });

      return {
        id: story.id,
        title: story.title,
        authors: authors,
        description: story.description,
        firstPageId: story.firstPageId,
        genres: genres
      }
    });
  }
};