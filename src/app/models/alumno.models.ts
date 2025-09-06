import { Model, DataTypes, Optional } from 'sequelize'
import sequelize from '../../config/database'
import { TipoDocumento } from './tipoDocumento.models'
import { Pais } from './pais.models'
import { Departamento } from './departamento.models'
import { IAlumno } from '../interfaces/Alumno/IAlumno'

interface AlumnoCreationAttributes extends Optional<IAlumno, 'id'> { }

export class Alumno extends Model<IAlumno, AlumnoCreationAttributes> implements IAlumno {
    public id?: number | undefined
    public id_tipodocumento?: number | undefined
    public id_pais?: number | undefined
    public id_departamento?: number | undefined
    public numero_documento?: string | undefined
    public apellido_paterno?: string | undefined
    public apellido_materno?: string | undefined
    public nombres?: string | undefined
    public nombre_capitalized?: string | undefined
    public telefono?: string | undefined
    public direccion?: string | undefined
    public email?: string | undefined
    public fecha_nacimiento?: Date | undefined
    public fecha_nacimiento_str?: string | undefined
    public sexo?: string | undefined
    public nombre_pais?: string | undefined
    public nombre_departamento?: string | undefined
    public user_crea?: string | undefined
    public user_actualiza?: string | undefined
    public user_elimina?: string | undefined
    public sistema?: boolean | undefined
    public estado?: boolean | undefined

    // Timestamps
    public readonly createdAt!: Date
    public readonly updatedAt!: Date

    // Asociaciones
    public getTipoDocumento?: () => Promise<TipoDocumento>
    public getPais?: () => Promise<Pais>
    public getDepartamento?: () => Promise<Departamento>
}

Alumno.init({
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
    id_pais: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Pais,
            key: 'id'
        }
    },
    id_departamento: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Departamento,
            key: 'id'
        }
    },
    numero_documento: {
        type: DataTypes.STRING(13),
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
    nombres: {
        type: DataTypes.STRING(40),
        allowNull: false
    },
    nombre_capitalized: {
        type: DataTypes.STRING(80),
        allowNull: true
    },
    telefono: {
        type: DataTypes.STRING(15),
        allowNull: false
    },
    direccion: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    email: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    fecha_nacimiento: {
        type: DataTypes.DATE,
        allowNull: false
    },
    fecha_nacimiento_str: {
        type: DataTypes.STRING(12),
        allowNull: true
    },
    sexo: {
        type: DataTypes.CHAR(1),
        allowNull: false
    },
    nombre_pais: {
        type: DataTypes.STRING(30),
        allowNull: true
    },
    nombre_departamento: {
        type: DataTypes.STRING(40),
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
    tableName: 'alumno',
    modelName: 'Alumno',
    sequelize,
    timestamps: true,
    freezeTableName: true
})