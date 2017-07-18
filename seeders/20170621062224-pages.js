'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Pages', [
      { id: '1080f223-a9a0-482d-9a68-133998bef225', storyId: '70d803bd-a47c-47fb-9c5a-2212ca08fdef', content: 'There is someone attacking you. What do you do?' },
      { id: '4ad8876a-63d1-4293-a602-9ddd676bae48', storyId: '70d803bd-a47c-47fb-9c5a-2212ca08fdef', content: 'The attacker pulls out a samurai sword.' },
      { id: '8ba6dada-f3af-4633-9ea7-70607ce6e51d', storyId: '70d803bd-a47c-47fb-9c5a-2212ca08fdef', content: 'The attacker approaches.' },
      { id: '4ada7d0a-490e-4211-ab00-41d0d9a9edc2', storyId: '70d803bd-a47c-47fb-9c5a-2212ca08fdef', content: 'You dead.' },
    ], {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Pages', null, {});
  }
};
