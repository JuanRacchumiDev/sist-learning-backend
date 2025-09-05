import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../../config/database'
import { IPerfil } from '../interfaces/Perfil/IPerfil';
import { Usuario } from './usuario.models';

interface PerfilAttributes extends Optional<IPerfil, 'id'> { }

export class Perfil extends Model<IPerfil, PerfilAttributes> implements IPerfil {
    public id?: number | undefined;
    public nombre?: string | undefined;
    public nombre_url?: string | undefined;
    public user_crea?: string | undefined;
    public user_actualiza?: string | undefined;
    public user_elimina?: string | undefined;
    public sistema?: boolean | undefined;
    public estado?: boolean | undefined;

    // Timestamps
    public readonly createdAt!: Date
    public readonly updatedAt!: Date

    // Asociacione
    public getUsuarios?: () => Promise<Usuario>
}

Perfil.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
    modelName: 'Perfil',
    tableName: 'perfil',
    sequelize,
    timestamps: true,
    freezeTableName: true
})

// export default Perfil