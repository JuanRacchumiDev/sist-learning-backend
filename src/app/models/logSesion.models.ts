import { Model, DataTypes, Optional } from 'sequelize'
import sequelize from '../../config/database'
import { Usuario } from './usuario.models'
import { ILogSesion } from '../interfaces/LogSesion/ILogSesion'

interface LogSesionAttributes extends Optional<ILogSesion, 'id'> { }

export class LogSesion extends Model<ILogSesion, LogSesionAttributes> implements ILogSesion {
    public id?: number | undefined
    public id_usuario?: number | undefined
    public token?: string | undefined
    public fecha_sesion?: string | undefined
    public user_agent?: string | undefined

    // Timestamps
    public readonly createdAt!: Date
    public readonly updatedAt!: Date

    // Asociaciones
    public getUsuario?: () => Promise<Usuario>
}

LogSesion.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Usuario,
            key: "id"
        }
    },
    token: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    fecha_sesion: {
        type: DataTypes.DATE,
        allowNull: true
    },
    user_agent: {
        type: DataTypes.STRING(10),
        allowNull: false
    }
}, {
    modelName: 'LogSesion',
    tableName: 'logsesion',
    sequelize,
    timestamps: true,
    freezeTableName: true
})

// LogSesion.belongsTo(Usuario, { foreignKey: 'id_usuario' })

// export default LogSesion