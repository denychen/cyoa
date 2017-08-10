'use strict'
let config = require('../config/config.json');
var StoryError = require('../errors/storyError');

module.exports = {
  titlePremiseLengths(req, res, next) {
    let title = req.body.story.title;
    let description = req.body.story.description;

    if (title.length > config.maxTitleLength) {
      return next(new StoryError(`Max title length is ${config.maxTitleLength} characters`, 400));
    } else if (description.length > config.maxPremiseLength) {
      return next(new StoryError(`Max premise length is ${config.maxPremiseLength} characters`, 400));
    }

    return next();
  },

  pageNameContentLengths(req, res, next) {
    let name = req.body.page.name;
    let content = req.body.page.content;

    if (name.length > config.maxPageNameLength) {
      return next(new StoryError(`Max page title length is ${config.maxPageNameLength} characters`, 400));
    } else if (content.length > config.maxPageContentLength) {
      return next(new StoryError(`Max page content length is ${config.maxPageContentLength} characters`, 400));
    }

    return next();
  }
};