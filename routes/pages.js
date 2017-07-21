'use strict';

var express = require('express');
var router = express.Router();

var pagesController = require('../controllers/pages');

/* GET page listing. */
router.get('/:pageId', function(req, res, next) {
  let pageId = req.params.pageId;

  pagesController.findPageAndNextPagesById(pageId).then(result => {
    res.json(result);
  });
});

/* POST page */
router.post('/', function(req, res, next) {
  let page = req.body.page;

  let storyId = page.story;
  let content = page.content;
  let name = page.name;

  pagesController.createPage(storyId, content, name).then(result => {
    res.json(result);
  });
});

/* PUT page */
router.put('/:pageId', function(req, res, next) {
  let page = req.body.page;

  let pageId = req.params.pageId;
  let pageName = page.name;
  let pageContent = page.content;
  let destinations = page.destinations;

  pagesController.updatePage(pageId, pageName, pageContent).then(result => {
    let promises = [];

    promises.concat(pagesController.removePageRoutes(pageId, destinations));
    promises = promises.concat(destinations.map(destination => {
      return pagesController.upsertPageRoutes(pageId, destination).then(result => {
        return result.status;
      });
    }));

    Promise.all(promises).then(results => {
      if (results.every(result => result === 204)) {
        res.sendStatus(204);
      }
    });
  });
});

/* POST page route */
router.post('/:pageId', function(req, res, next) {
  let pageId = req.params.pageId;
  let options = req.body.options;

  pagesController.createPageRoute(pageId, options).then(result => {
    res.json(result);
  });
});

/* DELETE page route */
router.delete('/:pageId', function(req, res, next) {
  let pageId = req.params.pageId;

  pagesController.removePage(pageId).then(result => {
    res.json(result);
  });
});

module.exports = router;
