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
    await queryInterface.createTable('adjunto', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      id_tipoadjunto: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'tipoadjuntos',
          key: 'id'
        }
      },
      id_grupoadjunto: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'grupoadjunto',
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
        allowNull: false,
        unique: true
      },
      titulo_url: {
        type: Sequelize.STRING(80),
        allowNull: false,
        unique: true
      },
      descripcion: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      filename: {
        type: Sequelize.STRING(120),
        allowNull: false
      },
      originalname: {
        type: Sequelize.STRING(180),
        allowNull: false
      },
      filepath: {
        type: Sequelize.STRING(150),
        allowNull: false
      },
      mimetype: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      size: {
        type: Sequelize.INTEGER,
        allowNull: false
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
    await queryInterface.dropTable('adjunto');
  }
};
