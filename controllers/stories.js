'use strict';

const Sequelize = require('sequelize');
const Story = require('../models').Story;
const Genre = require('../models').Genre;
const User = require('../models').User;
const GenreStory = require('../models').GenreStory;
const StoryUser = require('../models').StoryUser;
const Page = require('../models').Page;

module.exports = {
  create(title, author, description, genres) {
    let newStory = new Story({
      title: title,
      description: description
    });

    return newStory.save().then(story => {
      let newStoryUser = new StoryUser({
        storyId: story.id,
        userId: author.id
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

  update(storyId, newTitle, newDescription, published, firstPageId) {
    return Story.findOne({
      where: {
        id: storyId
      }
    }).then(story => {
      story.title = newTitle;
      story.description = newDescription;
      story.published = published;
      story.firstPageId = firstPageId;
      
      return story.save().then(story => {
        return {
          story: {
            id: story.id
          }
        };
      });
    });
  },

  findAllPublished() {
    return Story.findAll({
      include: [{
        model: User
      }],
      order: [
        [Sequelize.literal('`users.StoryUser.createdAt`'), 'ASC']
      ],
      where: {
        published: true
      }
    }).then(stories => {
      let serializedStories = stories.map(story => {
        let shortenedDescription = story.description;
        let maxDescriptionLength = 140;

        if (shortenedDescription.length > maxDescriptionLength) {
          shortenedDescription = shortenedDescription.substring(0, maxDescriptionLength).concat('…');
        }

        let serializedAuthors = story.Users.map(user => {
          return {
            id: user.id,
            username: user.username,
          };
        });

        return {
          id: story.id,
          title: story.title,
          authors: serializedAuthors,
          published: story.published,
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
    return Story.findOne({
      include: [{
        model: Genre
      }, {
        model: User
      }],
      where: { id: id }
    }).then(story => {
      let serializedAuthors = story.Users.map(user => {
        return {
          id: user.id,
          username: user.username,
        };
      });

      let serializedStory = {
        id: story.id,
        title: story.title,
        authors: serializedAuthors,
        description: story.description,
        firstPageId: story.firstPageId,
        genres: story.Genres.map(genre => genre.genre)
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
          ],
          raw: true
        }).then(pages => {
          serializedStory.pages = Array.from(new Set(pages.map(page => page.id)));

          let serializedDestinations = pages.reduce((result, page) => {
            if (page['destinations.PageRoute.id']) {
              return result.concat({
                id: page['destinations.PageRoute.id'],
                originId: page['destinations.PageRoute.originId'],
                pageId: page['destinations.PageRoute.destinationId'],
                option: page['destinations.PageRoute.option'],
                order: page['destinations.PageRoute.order']
              });
            }
            
            return result;
          }, []);

          let serializedPages = pages.reduce((result, page) => {
            if (result.some(previousPage => previousPage.id === page.id)) {
              return result;
            }

            let serializedPage = {
                id: page.id,
                name: page.name ? page.name : 'Untitled Page',
                content: page.content
            }

            if (serializedDestinations.length > 0) {
              serializedPage.destinations = serializedDestinations.reduce((result, destination) => {
                if (page['destinations.PageRoute.originId'] === destination.originId) {
                  return result.concat(destination.id);
                }

                return result;
              }, []);
            }

            result.push(serializedPage);
            return result;
          }, []);

          return {
            story: serializedStory,
            authors: serializedAuthors,
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