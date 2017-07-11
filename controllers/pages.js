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
    });
  }
};