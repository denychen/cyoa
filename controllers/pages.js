'use strict';

const Sequelize = require('sequelize');
const Page = require('../models').Page;

module.exports = {
  findPageAndNextPagesById(id) {
    return Page.find({
      include: [{
        model: Page,
        through: {
          attributes: ['option', 'order']
        },
        as: 'destinations'
      }],
      order: [
        [Sequelize.literal('`destinations.PageRoute.order`'), 'ASC']
      ],
      where: { id: id }
    }).then(page => {
      let destinations = page.destinations.map(page => {
        return {
          id: page.id,
          option: page.PageRoute.option,
          order: page.PageRoute.order
        };
      });

      return {
        id: page.id,
        content: page.content,
        destinations: destinations
      };
    });
  }
};