'use strict';

module.exports = {
  // up function gets executed when you run sequelize db:migrate
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Movies', 'genre', {
      type: Sequelize.STRING 
    })
  },

  // down function gets executed when you want to undo a migration 
  // sequelize db:migrate:undo 
  down: async (queryInterface, Sequelize) => {
    // remove column from Movies table and the name of the column is genre 
    return queryInterface.removeColumn('Movies', 'genre')
  }
};
