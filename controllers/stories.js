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

      let newGenreStories = genres.map(genre => {
        return {
          genreId: genre.id,
          storyId: story.id
        }
      });

      newStoryUser.save();
      GenreStory.bulkCreate(newGenreStories);

      return {
        story: {
          id: story.id
        }
      };
    });
  },

  update(storyId, newTitle, newDescription, newGenres, published, firstPublishedAt, firstPageId) {
    return Story.findOne({
      include: [{
        model: Genre
      }],
      where: { id: storyId }
    }).then(story => {
      story.title = newTitle;
      story.description = newDescription;
      story.published = published;
      story.firstPublishedAt = firstPublishedAt;
      story.firstPageId = firstPageId;

      let newGenreIds = newGenres.map(genre => parseInt(genre.id));
      let oldGenreIds = story.Genres.map(genre => genre.id);

      let genreIdsToDelete = oldGenreIds.filter(genreId => !newGenreIds.includes(genreId));
      let genreIdsToInsert = newGenreIds.filter(genreId => !oldGenreIds.includes(genreId));
      
      let storySavePromise = story.save().then(story => {
        return true;
      }).catch((error) => {
        return false;
      });

      let genreDestroyPromise = GenreStory.destroy({
        where: {
          storyId: storyId,
          genreId: { $in: genreIdsToDelete }
        }
      }).then(destroyed => {
        return destroyed === genreIdsToDelete.length;
      }).catch((error) => {
        return false;
      });

      let newGenreStories = genreIdsToInsert.map(genreId => {
        return {
          genreId: genreId,
          storyId: storyId
        }
      });
      let genreInsertPromise = GenreStory.bulkCreate(newGenreStories).then(genreStories => {
        return genreStories.length === genreIdsToInsert.length;
      }).catch((error) => {
        return false;
      });

      return [storySavePromise, genreInsertPromise, genreInsertPromise];
    });
  },

  delete(storyId) {
    return Story.destroy({
      where: { id: storyId }
    });
  },

  findAll(hasUser, user, lastStoryId, type) {
    let userWhere = null;
    let storyWhere = null;
    let limit = 5;
    let order = [];

    if (hasUser) {
      order.push(['updatedAt', 'DESC']);
      userWhere = { id: user.id };
      storyWhere = { published: type === 'published' };
    } else {
      order.push(['firstPublishedAt', 'DESC']);
      storyWhere = { published: true };
    }

    let storyPromise = function() {
      return Story.findAll({
        include: [{
          model: Genre
        }, {
          model: User,
          where: userWhere
        }],
        limit: limit,
        order: order,
        where: storyWhere
      }).then(stories => {
        let serializedStories = stories.map(story => {
          let shortenedDescription = story.description;
          let maxDescriptionLength = 140;

          if (shortenedDescription && shortenedDescription.length > maxDescriptionLength) {
            shortenedDescription = shortenedDescription.substring(0, maxDescriptionLength).concat('…');
          }

          let serializedAuthors = story.Users.map(user => {
            return {
              id: user.id,
              username: user.username,
            };
          });

          let serializedGenres = story.Genres.map(genre => {
            return {
              id: genre.id,
              genre: genre.genre
            };
          });

          return {
            id: story.id,
            title: story.title,
            authors: serializedAuthors,
            genres: serializedGenres,
            published: story.published,
            description: shortenedDescription,
            firstPublishedAt: story.firstPublishedAt,
            createdAt: story.createdAt
          };
        });

        return {
          stories: serializedStories
        };
      });
    };

    if (lastStoryId) {
      return Story.findOne({
        where: { id: lastStoryId }
      }).then(story => {
        if (hasUser) {
          storyWhere.updatedAt = {
            lt: story.updatedAt
          }
        } else {
          storyWhere.firstPublishedAt = {
            lt: story.firstPublishedAt
          }
        }
        return storyPromise();
      });
    } else {
      return storyPromise();
    }
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

      let serializedGenres = story.Genres.map(genre => {
        return {
          id: genre.id,
          genre: genre.genre
        };
      });

      let serializedStory = {
        id: story.id,
        title: story.title,
        authors: serializedAuthors,
        description: story.description,
        firstPageId: story.firstPageId,
        genres: serializedGenres,
        firstPublishedAt: story.firstPublishedAt
      };

      if (includePages) {
        return Page.findAll({
          include: [{
            model: Page,
            as: 'destinations',
            through: {
              attributes: ['id', 'destinationId', 'option', 'order']
            },
          }],
          where: { storyId: story.id },
          order: [
            ['createdAt', 'ASC'],
            [Sequelize.literal('`destinations.PageRoute.order`'), 'ASC']
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
                name: page.name,
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