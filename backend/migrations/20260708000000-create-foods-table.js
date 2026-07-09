'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('foods', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      category: {
        type: Sequelize.STRING(80),
        allowNull: false,
      },
      calories: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      protein: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      carbs: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      fat: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      portion_grams: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 100,
      },
      image_url: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('foods');
  },
};
