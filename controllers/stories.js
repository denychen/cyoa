'use strict';

const Sequelize = require('sequelize');
const Story = require('../models').Story;
const Genre = require('../models').Genre;
const User = require('../models').User;
const GenreStory = require('../models').GenreStory;
const StoryUser = require('../models').StoryUser;
const Page = require('../models').Page;

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

      let newGenreStories = genres.map(genre => {
        return {
          genreId: genre.id,
          storyId: story.id
        }
      });

      GenreStory.bulkCreate(newGenreStories);

      return {
        story: {
          id: story.id
        }
      };
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
      let serializedStories = stories.map(story => {
        let shortenedDescription = story.description;
        let maxDescriptionLength = 140;

        if (shortenedDescription.length > maxDescriptionLength) {
          shortenedDescription = shortenedDescription.substring(0, maxDescriptionLength).concat('…');
        }

        return {
          id: story.id,
          title: story.title,
          authors: story.Users.map(user => user.username),
          description: shortenedDescription,
          createdAt: story.createdAt
        };
      });

      return {
        stories: serializedStories
      };
    });
  },

  findById(id, includePages) {
    return Story.find({
      include: [{
        model: Genre
      }, {
        model: User
      }],
      where: { id: id }
    }).then(story => {
      let genres = story.Genres.map(genre => genre.genre);
      let authors = story.Users.map(user => user.username);

      let serializedStory = {
        id: story.id,
        title: story.title,
        authors: authors,
        description: story.description,
        firstPageId: story.firstPageId,
        genres: genres
      };

      if (includePages) {
        return Page.findAll({
          include: [{
            model: Page,
            through: {
              attributes: ['id', 'destinationId', 'option', 'order']
            },
            as: 'destinations'
          }],
          order: [
            [Sequelize.literal('`destinations.PageRoute.order`'), 'ASC']
          ],
          where: { storyId: story.id },
          order: [
            ['createdAt', 'ASC']
          ]
        }).then(pages => {
          serializedStory.pages = pages.map(page => page.id);

          let serializedDestinations = pages.reduce((result, page) => {
            let destinations = page.destinations;
            
            if (destinations.length > 0) {
              result = result.concat(destinations.map(destination => {
                return {
                  id: destination.PageRoute.id,
                  pageId: destination.PageRoute.destinationId,
                  option: destination.PageRoute.option,
                  order: destination.PageRoute.order
                };
              }));
            }
            return result;
          }, []);

          let serializedPages = pages.reduce((result, page) => {
            let destinations = page.destinations;

            let serializedPage = {
                id: page.id,
                name: page.name,
                content: page.content
            }

            if (destinations.length > 0) {
              serializedPage.destinations = page.destinations.map(destination => destination.PageRoute.id);
            }

            result.push(serializedPage);
            return result;
          }, []);

          return {
            story: serializedStory,
            pages: serializedPages,
            destinations: serializedDestinations
          };
        });
      } else {
        return {
          story: serializedStory,
        };
      }
    });
  }
};