'use strict';

const Sequelize = require('sequelize');
const Page = require('../models').Page;
const PageRoute = require('../models').PageRoute;
const Story = require('../models').Story;

module.exports = {
  createPage(storyId, content) {
    let newPage = new Page({
      storyId: storyId,
      content: content,
      name: name
    });

    return newPage.save().then(page => {
      let pageId = page.id;

      Story.find({
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
      where: {
        id: pageId
      }
    }).then(page => {
      return {
        status: 204
      };
    });
  },

  upsertPageRoutes(pageId, destination) {
    return PageRoute.find({
      where: {
        id: destination.id
      }
    }).then(pageRoute => {
      return PageRoute.upsert({
        id: destination.id,
        originId: pageId,
        destinationId: destination.pageId,
        option: destination.option,
        order: destination.order
      }).then(pageRoute => {
        return {
          status: 204
        };
      });
    });
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