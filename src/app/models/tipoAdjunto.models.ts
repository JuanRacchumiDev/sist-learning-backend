import { Model, DataTypes, Optional } from 'sequelize'
import sequelize from '../../config/database'
import { ITipoAdjunto } from '../interfaces/TipoAdjunto/ITipoAdjunto'
import { Adjunto } from './adjunto.models'

interface TipoAdjuntoAttributes extends Optional<ITipoAdjunto, 'id'> { }

export class TipoAdjunto extends Model<ITipoAdjunto, TipoAdjuntoAttributes> implements ITipoAdjunto {
    public id?: number | undefined
    public nombre?: string | undefined
    public nombre_url?: string | undefined
    public user_crea?: string | undefined
    public user_actualiza?: string | undefined
    public user_elimina?: string | undefined
    public estado?: boolean | undefined

    // Timestamps
    public readonly createdAt!: Date
    public readonly updatedAt!: Date

    // Asociaciones
    public getAdjuntos?: () => Promise<Adjunto[]>
}

TipoAdjunto.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    nombre_url: {
        type: DataTypes.STRING(40),
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
    estado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    modelName: 'TipoAdjunto',
    tableName: 'tipoadjunto',
    sequelize,
    timestamps: true
})

// export default TipoAdjunto