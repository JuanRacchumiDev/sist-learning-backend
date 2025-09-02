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
    await queryInterface.createTable('contenido', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      id_tipocontenido: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tipocontenido',
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
      titulo: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      titulo_url: {
        type: Sequelize.STRING(80),
        allowNull: false
      },
      descripcion: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      url: {
        type: Sequelize.STRING(80),
        allowNull: true
      },
      es_descargable: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      es_visible: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
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
    await queryInterface.dropTable("contenido");
  }
};
