'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('certificado', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      id_alumno: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'alumno',
          key: 'id'
        }
      },
      id_evento: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'evento',
          key: 'id'
        }
      },
      codigo: {
        type: Sequelize.STRING(12),
        allowNull: true
      },
      codigoQR: {
        type: Sequelize.STRING(350),
        allowNull: true
      },
      ruta: {
        type: Sequelize.STRING(350),
        allowNull: true
      },
      fileName: {
        type: Sequelize.STRING(300),
        allowNull: false
      },
      fecha_registro: {
        type: DataTypes.DATE,
        allowNull: true
      },
      fecha_descarga: {
        type: DataTypes.DATE,
        allowNull: true
      },
      fecha_envio: {
        type: Sequelize.DATE,
        allowNull: true
      },
      nombre_alumno_impresion: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      templateName: {
        type: DataTypes.STRING(120),
        allowNull: true
      },
      user_crea: {
        type: Sequelize.STRING(10),
        allowNull: true
      },
      user_actualiza: {
        type: Sequelize.STRING(10),
        allowNull: true
      },
      user_elimina: {
        type: Sequelize.STRING(10),
        allowNull: true
      },
      sistema: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      estado: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
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
    await queryInterface.dropTable('certificado');
  }
};
