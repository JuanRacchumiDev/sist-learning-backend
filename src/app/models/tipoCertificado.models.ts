import { DataTypes, Model, Optional } from "sequelize";
import sequelize from '../../config/database'
import { ITipoCertificado } from "../interfaces/TipoCertificado/ITipoCertificado";
import { Certificado } from "./certificado.models";

interface TipoCertificadoAttributes extends Optional<ITipoCertificado, 'id'> { }

export class TipoCertificado extends Model<ITipoCertificado, TipoCertificadoAttributes> implements ITipoCertificado {
    public id?: number | undefined;
    public nombre?: string | undefined;
    public user_crea?: string | undefined
    public user_actualiza?: string | undefined
    public user_elimina?: string | undefined
    public estado?: boolean | undefined

    // Timestamps
    public readonly createdAt!: Date
    public readonly updatedAt!: Date
    public readonly deletedAt?: Date

    public getCertificados?: () => Promise<Certificado>
}

TipoCertificado.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
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
    estado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    tableName: 'tipo_certificado',
    modelName: 'TipoCertificado',
    sequelize,
    timestamps: true,
    freezeTableName: true
})