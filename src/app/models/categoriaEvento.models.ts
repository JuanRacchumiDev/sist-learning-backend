import { Model, DataTypes, Optional } from 'sequelize'
import sequelize from '../../config/database'
import { ICategoriaEvento } from '../interfaces/CategoriaEvento/ICategoriaEvento'
import { Evento } from './evento.models'

interface CategoriaEventoAttributes extends Optional<ICategoriaEvento, 'id'> { }

export class CategoriaEvento extends Model<ICategoriaEvento, CategoriaEventoAttributes> implements ICategoriaEvento {
    public id?: number | undefined
    public nombre?: string | undefined
    public nombre_url?: string | undefined
    public user_crea?: string | undefined
    public user_actualiza?: string | undefined
    public user_elimina?: string | undefined
    public sistema?: boolean | undefined
    public estado?: boolean | undefined

    // Timestamps
    public readonly createdAt!: Date
    public readonly updatedAt!: Date

    // Asociaciones
    public getEventos?: () => Promise<Evento[]>
}

CategoriaEvento.init({
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
    sistema: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    estado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    modelName: 'CategoriaEvento',
    tableName: 'categoriaevento',
    sequelize,
    timestamps: true,
    freezeTableName: true
})