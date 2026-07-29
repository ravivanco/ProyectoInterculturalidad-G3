'use strict';

/** API-S5 — PG3-350, PG3-352, PG3-354 (Bryan Gualpa, Sprint 5) */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('patient_alerts', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      patient_id: { type: Sequelize.UUID, allowNull: false },
      alert_type: {
        type: Sequelize.ENUM(
          'adherencia_baja',
          'peso_tendencia',
          'consumo_extra',
          'comida_pendiente'
        ),
        allowNull: false,
      },
      message: { type: Sequelize.STRING(500), allowNull: false },
      severity: {
        type: Sequelize.ENUM('info', 'warning', 'critical'),
        defaultValue: 'warning',
      },
      acknowledged: { type: Sequelize.BOOLEAN, defaultValue: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('patient_alerts');
  },
};
