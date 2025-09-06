import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../../config/database'
import { TipoDocumento } from './tipoDocumento.models';
import { Cargo } from './cargo.models';
import { ITrabajador } from '../interfaces/Trabajador/ITrabajador';

interface TrabajadorAttributes extends Optional<ITrabajador, 'id'> { }

export class Trabajador extends Model<ITrabajador, TrabajadorAttributes> implements ITrabajador {
    public id?: number | undefined;
    public id_cargo?: number | undefined;
    public id_tipodocumento?: number | undefined;
    public numero_documento?: string | undefined;
    public apellido_paterno?: string | undefined;
    public apellido_materno?: string | undefined;
    public nombres?: string | undefined;
    public telefono?: string | undefined;
    public direccion?: string | undefined;
    public email?: string | undefined;
    public linkedin?: string | undefined;
    public fecha_nacimiento?: string | undefined;
    public biografia?: string | undefined;
    public sexo?: string | undefined;
    public firma?: string | undefined;
    public foto_perfil?: string | undefined;
    public user_crea?: string | undefined;
    public user_actualiza?: string | undefined;
    public user_elimina?: string | undefined;
    public sistema?: boolean | undefined;
    public estado?: boolean | undefined;

    // Timestamps
    public readonly createdAt!: Date
    public readonly updatedAt!: Date

    // Asociaciones
    public getCargo?: () => Promise<Cargo>
    public getTipoDocumento?: () => Promise<TipoDocumento>
}

Trabajador.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_cargo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Cargo,
            key: 'id'
        }
    },
    id_tipodocumento: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: TipoDocumento,
            key: 'id'
        }
    },
    numero_documento: {
        type: DataTypes.STRING(13),
        allowNull: false
    },
    apellido_paterno: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    apellido_materno: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    nombres: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    telefono: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    direccion: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    linkedin: {
        type: DataTypes.STRING(120),
        allowNull: true
    },
    fecha_nacimiento: {
        type: DataTypes.STRING(12),
        allowNull: false
    },
    biografia: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    sexo: {
        type: DataTypes.CHAR(1),
        allowNull: false
    },
    firma: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    foto_perfil: {
        type: DataTypes.STRING(100),
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
    modelName: 'Trabajador',
    tableName: 'trabajador',
    sequelize,
    timestamps: true,
    freezeTableName: true
})