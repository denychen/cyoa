'use strict';

var Page = require('../models').Page;

module.exports = {
  findPageAndNextPagesById(id) {
    return Page.find({
      include: [{
        model: Page,
        as: 'destinations'
      }],
      where: { id: id }
    });
  }
};