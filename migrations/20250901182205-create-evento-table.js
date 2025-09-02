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
    await queryInterface.createTable('evento', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      id_parent: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      id_categoriaevento: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      id_tipoevento: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tipoevento',
          key: 'id'
        }
      },
      id_instructor: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      capacidad_maxima: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      titulo: {
        type: Sequelize.STRING(120),
        allowNull: false,
        unique: true
      },
      titulo_url: {
        type: Sequelize.STRING(140),
        allowNull: false,
        unique: true
      },
      descripcion: {
        type: Sequelize.STRING(120),
        allowNull: true
      },
      temario: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      plantilla_certificado: {
        type: Sequelize.STRING(120),
        allowNull: null
      },
      fecha: {
        type: Sequelize.DATE,
        allowNull: true
      },
      fecha_fin: {
        type: Sequelize.STRING(12),
        allowNull: true
      },
      duracion: {
        type: Sequelize.STRING(10),
        allowNull: true
      },
      modalidad: {
        type: Sequelize.ENUM('Virtual', 'Presencial', 'Mixto'),
        allowNull: false
      },
      precio: {
        type: Sequelize.DOUBLE,
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
    await queryInterface.dropTable('evento');
  }
};
