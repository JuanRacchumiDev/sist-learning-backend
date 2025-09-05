import { Model, DataTypes, Optional } from 'sequelize'
import sequelize from '../../config/database'
import { Alumno } from './alumno.models'
import { Evento } from './evento.models'
import { Moneda } from '../../enums/EMoneda'
import { FormaPago } from '../../enums/EFormaPago'
import { TipoPago } from '../../enums/ETipoPago'
import { ModalidadPago } from '../../enums/EModalidadPago'
import { EstadoPago } from '../../enums/EEstadoPago'
import { IMatricula } from '../interfaces/Matricula/IMatricula'

interface MatriculaAttributes extends Optional<IMatricula, 'id'> { }

export class Matricula extends Model<IMatricula, MatriculaAttributes> implements IMatricula {
    public id?: number | undefined
    public id_alumno?: number | undefined
    public id_evento?: number | undefined
    public subtotal?: number | undefined
    public igv?: number | undefined
    public total?: number | undefined
    public moneda?: Moneda | undefined
    public fecha_pago?: string | undefined
    public forma_pago?: FormaPago | undefined
    public tipo_pago?: TipoPago | undefined
    public estado_pago?: EstadoPago | undefined
    public modalidad_pago?: ModalidadPago | undefined
    public nro_voucher?: string | undefined
    public nro_deposito?: string | undefined
    public imagen_pago?: string | undefined
    public acuenta?: number | undefined
    public saldo?: number | undefined
    public user_crea?: string | undefined
    public user_actualiza?: string | undefined
    public user_elimina?: string | undefined
    public estado?: boolean | undefined

    // Timestamps
    public readonly createdAt!: Date
    public readonly updatedAt!: Date

    // Asociaciones
    public getAlumno?: () => Promise<Alumno>
    public getEvento?: () => Promise<Evento>
}

Matricula.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_alumno: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Alumno,
            key: 'id'
        }
    },
    id_evento: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Evento,
            key: 'id'
        }
    },
    subtotal: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    igv: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    total: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    moneda: {
        type: DataTypes.ENUM(...Object.values(Moneda)),
        allowNull: false
    },
    fecha_pago: {
        type: DataTypes.STRING(12),
        allowNull: false
    },
    forma_pago: {
        type: DataTypes.ENUM(...Object.values(FormaPago)),
        allowNull: false
    },
    tipo_pago: {
        type: DataTypes.ENUM(...Object.values(TipoPago)),
        allowNull: false
    },
    estado_pago: {
        type: DataTypes.ENUM(...Object.values(EstadoPago)),
        allowNull: false
    },
    modalidad_pago: {
        type: DataTypes.ENUM(...Object.values(ModalidadPago)),
        allowNull: false
    },
    nro_voucher: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    nro_deposito: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    imagen_pago: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    acuenta: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0.00
    },
    saldo: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0.00
    },
    user_crea: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    user_actualiza: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    user_elimina: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    estado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    modelName: 'Matricula',
    tableName: 'matricula',
    sequelize,
    timestamps: true,
    freezeTableName: true
})

// Matricula.belongsTo(Alumno, { foreignKey: 'id_alumno' })

// Matricula.belongsTo(Evento, { foreignKey: 'id_evento' })

// export default Matricula