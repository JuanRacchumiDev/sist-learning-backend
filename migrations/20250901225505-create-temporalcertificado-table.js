'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('temporalcertificado', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      id_evento: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'evento',
          key: 'id'
        }
      },
      id_tipodocumento: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'tipodocumentos',
          key: 'id'
        }
      },
      numero_documento: {
        type: Sequelize.STRING(15),
        allowNull: true
      },
      tabla: {
        type: Sequelize.STRING(30),
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') // Común en MySQL para auto-actualización
      }
    }, {
      // Opciones de la tabla (opcional pero recomendado para la consistencia de la base de datos)
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    })
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('temporalcertificado')
  }
};
