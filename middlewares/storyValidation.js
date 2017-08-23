'use strict'
let config = require('../config/config.js');
var StoryError = require('../errors/storyError');

module.exports = {
  titlePremiseLengths(req, res, next) {
    let title = req.body.story.title;
    let description = req.body.story.description;

    if (title.length > config.maxTitleLength) {
      return next(new StoryError(`Max title length is ${config.maxTitleLength} characters`, 400));
    } else if (description && description.length > config.maxPremiseLength) {
      return next(new StoryError(`Max premise length is ${config.maxPremiseLength} characters`, 400));
    }

    return next();
  },

  pageNameContentLengths(req, res, next) {
    let name = req.body.page.name;
    let content = req.body.page.content;

    if (name && name.length > config.maxPageNameLength) {
      return next(new StoryError(`Max page title length is ${config.maxPageNameLength} characters`, 400));
    } else if (content && content.length > config.maxPageContentLength) {
      return next(new StoryError(`Max page content length is ${config.maxPageContentLength} characters`, 400));
    }

    return next();
  },

  pathCount(req, res, next) {
    let paths = req.body.page.destinations;

    if (paths && paths.length > config.maxPathCount) {
      return next(new StoryError(`Max path count is ${config.maxPathCount}`, 400));
    }

    return next();
  },

  pathOptionsLengths(req, res, next) {
    let paths = req.body.page.destinations;

    if (paths.some(path => path.option.length > config.maxPathOptionLength)) {
      return next(new StoryError(`Max path description length is ${config.maxPathOptionLength}`, 400));
    }

    return next();
  },

  genreCount(req, res, next) {
    let genres = req.body.story.genres;

    if (genres && genres.length > config.maxGenreCount) {
      return next(new StoryError(`Max genre count is ${config.maxGenreCount}`, 400));
    }

    return next();
  }
};