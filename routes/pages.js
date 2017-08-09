'use strict';

var express = require('express');
var router = express.Router();

var pagesController = require('../controllers/pages');
var authentication = require('../middlewares/authentication');

/* GET page listing. */
router.get('/:pageId', function(req, res, next) {
  let pageId = req.params.pageId;

  pagesController.findPageAndNextPagesById(pageId).then(result => {
    return res.json(result);
  });
});

/* POST page */
router.post('/', authentication.isAuthenticated, authentication.isAuthor, function(req, res, next) {
  let page = req.body.page;

  let storyId = page.story;
  let content = page.content;
  let name = page.name;

  pagesController.createPage(storyId, content, name).then(result => {
    return res.json(result);
  });
});

/* PUT page */
router.put('/:pageId', authentication.isAuthenticated, authentication.isAuthor, function(req, res, next) {
  let page = req.body.page;

  let pageId = req.params.pageId;
  let pageName = page.name;
  let pageContent = page.content;
  let destinations = page.destinations;

  let updatePagePromise = pagesController.updatePage(pageId, pageName, pageContent);
  let removePageRoutesPromise = pagesController.removePageRoutes(pageId, destinations);
  let upsertPageRoutesPromise = pagesController.upsertPageRoutes(pageId, destinations);

  let promises = [updatePagePromise, removePageRoutesPromise, upsertPageRoutesPromise];
  Promise.all(promises).then(results => {
    if (results.every(result => result.status === 0)) {
      if (destinations.some(destination => destination.pageId)) {
        return pagesController.findPageAndNextPagesById(pageId).then(page => {
          return res.status(201).json(page);
        });
      } else {
        return res.sendStatus(204);
      }
    } else {
      return res.sendStatus(400);
    }
  }).catch(error => {
    return res.sendStatus(500);
  });
});

/* POST page route */
router.post('/:pageId', authentication.isAuthenticated, authentication.isAuthor, function(req, res, next) {
  let pageId = req.params.pageId;
  let options = req.body.options;

  pagesController.createPageRoute(pageId, options).then(result => {
    return res.json(result);
  });
});

/* DELETE page route */
router.delete('/:pageId', authentication.isAuthenticated, authentication.isAuthor, function(req, res, next) {
  let pageId = req.params.pageId;

  pagesController.removePage(pageId).then(result => {
    return res.json(result);
  });
});

module.exports = router;
