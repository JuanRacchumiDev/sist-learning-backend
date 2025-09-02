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
    await queryInterface('tipodocumento', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      nombre: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      nombre_url: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      abreviatura: {
        type: Sequelize.STRING(5),
        allowNull: false
      },
      longitud: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      en_persona: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      en_empresa: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      compra: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      venta: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
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
        defaultValue: false
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
    await queryInterface.dropTable('tipodocumentos');
  }
};
