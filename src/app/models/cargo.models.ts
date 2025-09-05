import { Model, DataTypes, Optional } from 'sequelize'
import sequelize from '../../config/database'
import { ICargo } from '../interfaces/Cargo/ICargo'
import { Trabajador } from './trabajador.models'

interface CargoCreationAttributes extends Optional<ICargo, 'id'> { }

export class Cargo extends Model<ICargo, CargoCreationAttributes> implements ICargo {
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
    public getTrabajadores?: () => Promise<Trabajador[]>
}

Cargo.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    nombre_url: {
        type: DataTypes.STRING(70),
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
    tableName: 'cargo',
    modelName: 'Cargo',
    sequelize,
    timestamps: true,
    freezeTableName: true
})

// export default Cargo