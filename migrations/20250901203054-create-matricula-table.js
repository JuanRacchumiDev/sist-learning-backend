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
    await queryInterface.createTable('cargo', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: false
      },
      id_alumnno: {
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
      subtotal: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      igv: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      total: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      moneda: {
        type: Sequelize.ENUM('PEN', 'USD'),
        allowNull: false
      },
      fecha_pago: {
        type: Sequelize.STRING(12),
        allowNull: false
      },
      forma_pago: {
        type: Sequelize.ENUM('Contado', 'Crédito'),
        allowNull: false
      },
      tipo_pago: {
        type: Sequelize.ENUM('Efectivo', 'Tarjeta', 'Depósito', 'Mixto'),
        allowNull: false
      },
      estado_pago: {
        type: Sequelize.ENUM('Pendiente', 'Pagada', 'Confirmada', 'Anulada'),
        allowNull: false
      },
      modalidad_pago: {
        type: Sequelize.ENUM('Parcial', 'Total'),
        allowNull: false
      },
      nro_voucher: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      nro_deposito: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      imagen_pago: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      acuenta: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0
      },
      saldo: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0
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
    await queryInterface.dropTable('matricula');
  }
};
