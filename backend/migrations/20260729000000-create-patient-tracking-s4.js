'use strict';

/** API-S4 — PG3-341 a PG3-344 (Bryan Gualpa, Sprint 4) */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('meal_logs', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      patient_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      meal_type: {
        type: Sequelize.ENUM('desayuno', 'almuerzo', 'merienda', 'cena', 'otro'),
        allowNull: false,
      },
      description: { type: Sequelize.STRING(500), allowNull: true },
      calories: { type: Sequelize.FLOAT, allowNull: true },
      logged_at: { type: Sequelize.DATE, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.createTable('exercise_logs', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      patient_id: { type: Sequelize.UUID, allowNull: false },
      exercise_name: { type: Sequelize.STRING(255), allowNull: false },
      duration_minutes: { type: Sequelize.INTEGER, allowNull: false },
      completed_at: { type: Sequelize.DATE, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.createTable('weight_logs', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      patient_id: { type: Sequelize.UUID, allowNull: false },
      weight_kg: { type: Sequelize.FLOAT, allowNull: false },
      logged_at: { type: Sequelize.DATE, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.createTable('extra_consumptions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      patient_id: { type: Sequelize.UUID, allowNull: false },
      description: { type: Sequelize.STRING(500), allowNull: false },
      calories: { type: Sequelize.FLOAT, allowNull: false },
      image_url: { type: Sequelize.STRING(1024), allowNull: true },
      logged_at: { type: Sequelize.DATE, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('extra_consumptions');
    await queryInterface.dropTable('weight_logs');
    await queryInterface.dropTable('exercise_logs');
    await queryInterface.dropTable('meal_logs');
  },
};
