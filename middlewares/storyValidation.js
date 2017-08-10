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
  }
};