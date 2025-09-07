import { Model, DataTypes, Optional } from 'sequelize'
import sequelize from '../../config/database'
import { TipoDocumento } from './tipoDocumento.models'
import { EOrigen } from '../../enums/EOrigen'
import { IPersona } from '../interfaces/Persona/IPersona'

interface PersonaAttributes extends Optional<IPersona, 'id'> { }

export class Persona extends Model<IPersona, PersonaAttributes> implements IPersona {
    public id?: number | undefined
    public id_tipodocumento?: number | undefined
    public numero?: string | undefined
    public nombres?: string | undefined
    public apellido_paterno?: string | undefined
    public apellido_materno?: string | undefined
    public nombre_completo?: string | undefined
    public departamento?: string | undefined
    public provincia?: string | undefined
    public distrito?: string | undefined
    public direccion?: string | undefined
    public direccion_completa?: string | undefined
    public ubigeo_reniec?: string | undefined
    public ubigeo_sunat?: string | undefined
    public ubigeo?: string | undefined
    public fecha_nacimiento?: string | undefined
    public estado_civil?: string | undefined
    public foto?: string | undefined
    public sexo?: string | undefined
    public origen?: EOrigen | undefined
    public sistema?: boolean | undefined
    public estado?: boolean | undefined

    // Timestamps
    public readonly createdAt!: Date
    public readonly updatedAt!: Date
    public readonly deletedAt?: Date

    // Asociaciones
    public getTipoDocumento?: () => Promise<TipoDocumento>
}

Persona.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_tipodocumento: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: TipoDocumento,
            key: 'id'
        }
    },
    numero: {
        type: DataTypes.STRING(13),
        allowNull: false
    },
    nombres: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    apellido_paterno: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    apellido_materno: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    nombre_completo: {
        type: DataTypes.STRING(70),
        allowNull: false
    },
    departamento: {
        type: DataTypes.STRING(30),
        allowNull: true
    },
    provincia: {
        type: DataTypes.STRING(30),
        allowNull: true
    },
    distrito: {
        type: DataTypes.STRING(30),
        allowNull: true
    },
    direccion: {
        type: DataTypes.STRING(90),
        allowNull: true
    },
    direccion_completa: {
        type: DataTypes.STRING(150),
        allowNull: true
    },
    ubigeo_reniec: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    ubigeo_sunat: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    ubigeo: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    fecha_nacimiento: {
        type: DataTypes.STRING(12),
        allowNull: false,
        defaultValue: ''
    },
    estado_civil: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    foto: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    sexo: {
        type: DataTypes.CHAR(1),
        allowNull: false
    },
    origen: {
        type: DataTypes.ENUM(...Object.values(EOrigen)),
        allowNull: false
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
    modelName: 'Persona',
    tableName: 'persona',
    sequelize,
    timestamps: true,
    freezeTableName: true
})