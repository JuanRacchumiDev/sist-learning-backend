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
    await queryInterface.createTable('usuario', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: false
      },
      id_trabajador: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'trabajador',
          key: 'id'
        }
      },
      id_instructor: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'instructor',
          key: 'id'
        }
      },
      id_alumno: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'alumno',
          key: 'id'
        }
      },
      id_perfil: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'perfil',
          key: 'id'
        }
      },
      username: {
        type: Sequelize.STRING(10),
        allowNull: false
      },
      password: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      token: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      fecha_sesion: {
        type: Sequelize.DATE,
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
    await queryInterface.dropTable('usuario')
  }
};
