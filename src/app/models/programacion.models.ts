import { Model, DataTypes, Optional } from 'sequelize'
import sequelize from '../../config/database'
import { Evento } from './evento.models'
import { Trabajador } from './trabajador.models'
import { IProgramacion } from '../interfaces/Programacion/IProgramacion'

interface ProgramacionAttributes extends Optional<IProgramacion, 'id'> { }

export class Programacion extends Model<IProgramacion, ProgramacionAttributes> implements IProgramacion {
    public id?: number | undefined
    public id_trabajador?: number | undefined
    public id_evento?: number | undefined
    public descripcion?: string | undefined
    public enlace?: string | undefined
    public fecha_inicio?: string | undefined
    public fecha_final?: string | undefined
    public fecha_reprograma?: string | undefined
    public fecha_cancela?: string | undefined
    public fecha_registro?: string | undefined
    public user_crea?: string | undefined
    public user_actualiza?: string | undefined
    public user_elimina?: string | undefined
    public estado?: boolean | undefined

    // Timestamps
    public readonly createdAt!: Date
    public readonly updatedAt!: Date

    // Asociaciones
    public getTrabajador?: () => Promise<Trabajador>
    public getEvento?: () => Promise<Evento>
}

Programacion.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_trabajador: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Trabajador,
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
    descripcion: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    enlace: {
        type: DataTypes.STRING(150),
        allowNull: true
    },
    fecha_inicio: {
        type: DataTypes.STRING(12),
        allowNull: false
    },
    fecha_final: {
        type: DataTypes.STRING(12),
        allowNull: true
    },
    fecha_reprograma: {
        type: DataTypes.STRING(12),
        allowNull: true
    },
    fecha_cancela: {
        type: DataTypes.STRING(12),
        allowNull: true
    },
    fecha_registro: {
        type: DataTypes.STRING(12),
        allowNull: true
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
    modelName: 'Programacion',
    tableName: 'programacion',
    sequelize,
    timestamps: true,
    freezeTableName: true
})