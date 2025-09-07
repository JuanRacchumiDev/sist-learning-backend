import { Model, DataTypes, Optional } from "sequelize";
import sequelize from '../../config/database'
import { IPlantilla } from "../interfaces/Plantilla/IPlantilla";
import { Evento } from "./evento.models";

interface PlantillaAttributes extends Optional<IPlantilla, 'id'> { }

export class Plantilla extends Model<IPlantilla, PlantillaAttributes> implements IPlantilla {
    public id?: number | undefined;
    public id_evento?: number | undefined;
    public nombre?: string | undefined;
    public file?: Buffer | undefined;
    public path?: string | undefined;
    public user_crea?: string | undefined;
    public user_actualiza?: string | undefined;
    public user_elimina?: string | undefined;
    public estado?: boolean | undefined;

    // Timestamps
    public readonly createdAt!: Date
    public readonly updatedAt!: Date
    public readonly deletedAt?: Date

    // Asociaciones
    public getEvento?: () => Promise<Evento>
}

Plantilla.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_evento: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Evento,
            key: 'id'
        }
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    file: {
        type: DataTypes.BLOB('long'),
        allowNull: true
    },
    path: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    user_crea: {
        type: DataTypes.UUID,
        allowNull: true
    },
    user_actualiza: {
        type: DataTypes.UUID,
        allowNull: true
    },
    user_elimina: {
        type: DataTypes.UUID,
        allowNull: true
    },
    estado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    tableName: 'plantilla',
    modelName: 'Plantilla',
    sequelize,
    timestamps: true,
    paranoid: true,
    underscored: true
})