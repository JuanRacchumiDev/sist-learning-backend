import { Model, DataTypes, Optional } from 'sequelize'
import sequelize from '../../config/database'
import { ITipoDocumento } from '../interfaces/TipoDocumento/ITipoDocumento'
import { Persona } from './persona.models'
import { Alumno } from './alumno.models'
import { Trabajador } from './trabajador.models'

interface TipoDocumentoAttributes extends Optional<ITipoDocumento, 'id'> { }

export class TipoDocumento extends Model<ITipoDocumento, TipoDocumentoAttributes> implements ITipoDocumento {
    public id?: number | undefined
    public nombre?: string | undefined
    public nombre_url?: string | undefined
    public abreviatura?: string | undefined
    public longitud?: number | undefined
    public en_persona?: boolean | undefined
    public en_empresa?: boolean | undefined
    public compra?: boolean | undefined
    public venta?: boolean | undefined
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
    public getPersonas?: () => Promise<Persona[]>
    public getAlumnos?: () => Promise<Alumno[]>
    public getTrabajadores?: () => Promise<Trabajador[]>
}

TipoDocumento.init({
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
        type: DataTypes.STRING(100),
        allowNull: false
    },
    abreviatura: {
        type: DataTypes.STRING(5),
        allowNull: false
    },
    longitud: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    en_persona: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    en_empresa: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    compra: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    venta: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
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
    modelName: 'TipoDocumento',
    tableName: 'tipo_documento',
    sequelize,
    timestamps: true,
    freezeTableName: true
})