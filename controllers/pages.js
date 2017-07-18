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
    return Page.find({
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
      where: { id: id }
    }).then(page => {
      let serializedDestinations = page.destinations.map(page => {
        return {
          id: page.PageRoute.id,
          option: page.PageRoute.option,
          order: page.PageRoute.order
        };
      });

      return {
        page: {
          id: page.id,
          content: page.content,
          destinations: serializedDestinations.map(destination => destination.id)
        },
        destinations: serializedDestinations
      };
    });
  }
};