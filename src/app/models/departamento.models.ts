import { Model, DataTypes, Optional } from 'sequelize'
import sequelize from '../../config/database'
import { Pais } from './pais.models'
import { IDepartamento } from '../interfaces/Departamento/IDepartamento'

interface DepartamentoAttibutes extends Optional<IDepartamento, 'id'> { }

export class Departamento extends Model<IDepartamento, DepartamentoAttibutes> implements IDepartamento {
    public id?: number | undefined
    public id_pais?: number | undefined
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
    public readonly deletedAt?: Date

    // Asociaciones
    public getPais?: () => Promise<Pais>
}

Departamento.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_pais: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Pais,
            key: 'id'
        }
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
    modelName: 'Departamento',
    tableName: 'departamento',
    sequelize,
    timestamps: true,
    freezeTableName: true
})