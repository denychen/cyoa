'use strict';

const Genre = require('../models').Genre;

module.exports = {
  findAll() {
    return Genre.findAll(
      { 
        order: [
          ['genre', 'ASC']
        ] 
      }).then(genres => {
      return genres.map(genre => {
        return {
          id: genre.id,
          genre: genre.genre
        };
      });
    });
  },
};