import { Model, DataTypes, Optional } from 'sequelize'
import sequelize from '../../config/database'
import { IGrupoAdjunto } from '../interfaces/GrupoAdjunto/IGrupoAdjunto'
import { Adjunto } from './adjunto.models'

interface GrupoAdjuntoAttributes extends Optional<IGrupoAdjunto, 'id'> { }

export class GrupoAdjunto extends Model<IGrupoAdjunto, GrupoAdjuntoAttributes> implements IGrupoAdjunto {
    public id?: number | undefined
    public nombre?: string | undefined
    public nombre_url?: string | undefined
    public user_crea?: string | undefined
    public user_actualiza?: string | undefined
    public user_elimina?: string | undefined
    public sistema?: boolean | undefined
    public estado?: boolean | undefined

    // Timestamps
    public readonly createdA!: Date
    public readonly updatedAt!: Date

    // Asociaciones
    public getAdjuntos?: () => Promise<Adjunto[]>
}

GrupoAdjunto.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    nombre_url: {
        type: DataTypes.STRING(50),
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
    modelName: 'GrupoAdjunto',
    tableName: 'grupoadjunto',
    sequelize,
    timestamps: true,
    freezeTableName: true
})