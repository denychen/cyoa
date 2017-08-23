'use strict';

const Sequelize = require('sequelize');
const Page = require('../models').Page;
const PageRoute = require('../models').PageRoute;
const Story = require('../models').Story;

module.exports = {
  createPage(storyId, content, name) {
    let newPage = new Page({
      storyId: storyId,
      content: content,
      name: name
    });

    return newPage.save().then(page => {
      let pageId = page.id;

      Story.findOne({
        where: { id: storyId }
      }).then(story => {
        if (story.firstPageId === null) {
          story.firstPageId = pageId;
          story.save();
        }
      });

      return {
        page: {
          id: pageId
        }
      };
    });
  },

  updatePage(pageId, name, content) {
    return Page.update({
      content: content,
      name: name
    }, {
      where: { id: pageId }
    }).then(result => {
      return {
        status: 0,
        updated: result[0]
      };
    }).catch(error => {
      return false;
    });
  },

  updatePageRoutes(pageId, destinations) {
    let updatedDestinations = destinations.map(destination => {
      return {
        id: destination.id,
        originId: pageId,
        destinationId: destination.pageId,
        option: destination.option,
        order: destination.order
      };
    });

    return PageRoute.bulkCreate(updatedDestinations, {
      updateOnDuplicate: ['id', 'originId', 'destinationId', 'option', 'order']
    }).then(result => {
      let serializedDestinations = result.map(pageRoute => {
        return {
          id: pageRoute.destinationId
        };
      });

      return module.exports.removePageRoutes(pageId, serializedDestinations).then(() => {
        return {
          status: 0,
          result: result
        };
      }).catch(error => {
        return false;
      });
    }).catch(error => {
      return false;
    });
  },

  removePageRoutes(pageId, destinations) {
    return PageRoute.destroy({
      where: {
        originId: pageId,
        destinationId: {
          $notIn: destinations.map(destination => destination.id)
        }
      }
    }).then(result => {
      return {
        status: 0,
        deleted: result
      };
    }).catch(error => {
      return false;
    })
  },

  createPageRoute(pageId, options) {
    let newPageRoutes = options.map((option, index) => {
      return {
        originId: pageId,
        destinationId: option.optionId,
        option: option.option,
        order: index + 1
      }
    });

    return PageRoute.bulkCreate(newPageRoutes).then(() => {
      return {};
    });
  },

  removePage(pageId) {
    return Story.findOne({
      where: { firstPageId: pageId}
    }).then(story => {
      if (!story) {
        return Page.destroy({
          where: { id: pageId }
        }).then(page => {
          return {
            id: pageId
          };
        });
      } else {
        return null;
      }
    });
  },

  findPageAndNextPagesById(id) {
    return Page.findAll({
      include: [{
        model: Page,
        through: {
          attributes: ['id', 'option', 'order']
        },
        as: 'destinations'
      }],
      order: [
        [Sequelize.literal('`destinations.PageRoute.order`'), 'ASC']
      ],
      where: { id: id },
      raw: true
    }).then(pages => {
      let serializedDestinations = pages.reduce((result, page) => {
        let serializedPage = {
          id: page['destinations.PageRoute.id'],
          option: page['destinations.PageRoute.option'],
          pageId: page['destinations.PageRoute.destinationId'],
          order: page['destinations.PageRoute.order']
        };

        if (serializedPage.id !== null) {
          result = result.concat(serializedPage);
        }

        return result;
      }, []);

      return {
        page: {
          id: pages[0].id,
          content: pages[0].content,
          destinations: serializedDestinations.map(destination => destination.id)
        },
        destinations: serializedDestinations
      };
    });
  }
};