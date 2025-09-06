import { Model, DataTypes, Optional } from 'sequelize'
import sequelize from '../../config/database'
import { ITipoEvento } from '../interfaces/TipoEvento/ITipoEvento'
import { Evento } from './evento.models'

interface TipoEventoAttributes extends Optional<ITipoEvento, 'id'> { }

export class TipoEvento extends Model<ITipoEvento, TipoEventoAttributes> implements ITipoEvento {
    public id?: number | undefined
    public nombre?: string | undefined
    public nombre_url?: string | undefined
    public descripcion?: string | undefined
    public user_crea?: string | undefined
    public user_actualiza?: string | undefined
    public user_elimina?: string | undefined
    public estado?: boolean | undefined

    // Timestamps
    public readonly createdAt!: Date
    public readonly updatedAt!: Date

    // Asociaciones
    public getEventos?: () => Promise<Evento[]>
}

TipoEvento.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING(40),
        allowNull: false
    },
    nombre_url: {
        type: DataTypes.STRING(60),
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING(100),
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
    modelName: 'TipoEvento',
    tableName: 'tipoevento',
    sequelize,
    timestamps: true,
    freezeTableName: true
})