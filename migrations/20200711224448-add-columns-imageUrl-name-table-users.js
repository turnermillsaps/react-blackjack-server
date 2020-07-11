'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'users',
      'name',
      {
        type: Sequelize.STRING
      }
    )
      .then(() => {
        return queryInterface.addColumn(
          'users',
          'imageUrl',
          {
            type: Sequelize.STRING
          }
        )
      })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'users',
      'name'
    )
      .then(() => {
        return queryInterface.removeColumn(
          'users',
          'imageUrl'
        )
      })
  }
};
