'use strict';

const { query } = require("express");

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addConstraint('users', {
      fields: ['googleId'],
      type: 'unique',
      name: 'unique_googleId_constraint'
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeConstraint('users', 'unique_googleId_constraint')
  }
};
