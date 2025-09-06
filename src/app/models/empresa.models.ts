import { Model, DataTypes, Optional } from 'sequelize'
import sequelize from '../../config/database'
import { IEmpresa } from '../interfaces/Empresa/IEmpresa'

interface EmpresaCreationAttributes extends Optional<IEmpresa, 'id'> { }

export class Empresa extends Model<IEmpresa, EmpresaCreationAttributes> implements IEmpresa {
    public id?: number | undefined
    public nombre?: string | undefined
    public direccion?: string | undefined
    public telefono?: string | undefined
    public email?: string | undefined
    public redes_sociales?: string | undefined
    public logo?: string | undefined
    public lema?: string | undefined
    public user_crea?: string | undefined
    public user_actualiza?: string | undefined
    public user_elimina?: string | undefined
    public sistema?: boolean | undefined
    public estado?: boolean | undefined

    // Timestamps
    public readonly createdAt!: Date
    public readonly updatedAt!: Date
}

Empresa.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING(60),
        allowNull: false
    },
    direccion: {
        type: DataTypes.STRING(80),
        allowNull: true
    },
    telefono: {
        type: DataTypes.STRING(13),
        allowNull: true
    },
    email: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    redes_sociales: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    logo: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    lema: {
        type: DataTypes.STRING(60),
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
    modelName: 'Empresa',
    tableName: 'empresa',
    sequelize,
    timestamps: true,
    freezeTableName: true
})