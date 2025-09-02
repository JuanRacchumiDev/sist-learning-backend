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
    await queryInterface.createTable('persona', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      id_tipodocumento: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tipodocumentos',
          key: 'id',
        },
      },
      numero: {
        type: Sequelize.STRING(13),
        allowNull: false,
      },
      nombres: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      apellido_paterno: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      apellido_materno: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      nombre_completo: {
        type: Sequelize.STRING(70),
        allowNull: false,
      },
      departamento: {
        type: Sequelize.STRING(30),
        allowNull: true,
      },
      provincia: {
        type: Sequelize.STRING(30),
        allowNull: true,
      },
      distrito: {
        type: Sequelize.STRING(30),
        allowNull: true,
      },
      direccion: {
        type: Sequelize.STRING(90),
        allowNull: true,
      },
      direccion_completa: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },
      ubigeo_reniec: {
        type: Sequelize.STRING(10),
        allowNull: true,
      },
      ubigeo_sunat: {
        type: Sequelize.STRING(10),
        allowNull: true,
      },
      ubigeo: {
        type: Sequelize.STRING(10),
        allowNull: true,
      },
      fecha_nacimiento: {
        type: Sequelize.STRING(12),
        allowNull: false
      },
      estado_civil: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      foto: {
        type: Sequelize.STRING(200),
        allowNull: true
      },
      sexo: {
        type: Sequelize.STRING(1),
        allowNull: false,
      },
      origen: {
        type: Sequelize.ENUM('Web', 'Api', 'App'),
        allowNull: false,
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
      // Timestamps necesarios debido a `timestamps: true` en el modelo
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
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('persona');
  }
};
