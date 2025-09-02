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
    await queryInterface.createTable('trabajador', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      id_cargo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'cargo',
          key: 'id'
        }
      },
      id_tipodocumento: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tipodocumentos',
          key: 'id',
        },
      },
      numero_documento: {
        type: Sequelize.STRING(13),
        allowNull: false,
      },
      apellido_paterno: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      apellido_materno: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      nombres: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      telefono: {
        type: Sequelize.STRING(30),
        allowNull: false
      },
      direccion: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      linkedin: {
        type: Sequelize.STRING(120),
        allowNull: true
      },
      fecha_nacimiento: {
        type: Sequelize.STRING(12),
        allowNull: false
      },
      biografia: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      sexo: {
        type: Sequelize.STRING(1),
        allowNull: false
      },
      firma: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      foto_perfil: {
        type: Sequelize.STRING(100),
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
    await queryInterface.dropTable('trabajador')
  }
};
