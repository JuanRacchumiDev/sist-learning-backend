import sequelize from '../../config/database'
import { Model, DataTypes, Optional } from 'sequelize'
import { ITemporal } from '../interfaces/Temporal/ITemporal'
import { Evento } from './evento.models'
import { Usuario } from './usuario.models'
import { Perfil } from './perfil.models'

interface TemporalAttributes extends Optional<ITemporal, 'id'> { }

export class Temporal extends Model<ITemporal, TemporalAttributes> implements ITemporal {
    public id?: number | undefined
    public id_evento?: number | undefined
    public id_usuario?: number | undefined
    public id_perfil?: number | undefined
    public id_tipodocumento?: number | undefined
    public numero_documento?: string | undefined
    public nombre_impresion?: string | undefined
    public fecha_envio?: string | undefined
    public tabla?: string | undefined

    // Timestamps
    public readonly createdAt!: Date
    public readonly updatedAt!: Date

    // Asociaciones
    public getEvento?: () => Promise<Evento>
    public getUsuario?: () => Promise<Usuario>
    public getPerfil?: () => Promise<Perfil>
}

Temporal.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_evento: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    id_perfil: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    id_tipodocumento: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    numero_documento: {
        type: DataTypes.STRING(15),
        allowNull: true
    },
    nombre_impresion: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    fecha_envio: {
        type: DataTypes.STRING(15),
        allowNull: true
    },
    tabla: {
        type: DataTypes.STRING(30),
        allowNull: true
    }
}, {
    modelName: 'Temporal',
    tableName: 'temporal',
    sequelize,
    timestamps: true,
    freezeTableName: true
})

// export default Temporal