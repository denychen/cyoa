'use strict';

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
      where: { id: id }
    });
  }
};