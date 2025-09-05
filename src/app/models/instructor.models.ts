import { Model, DataTypes, Optional } from 'sequelize'
import sequelize from '../../config/database'
import { TipoDocumento } from './tipoDocumento.models'
import { Pais } from './pais.models'
import { IInstructor } from '../interfaces/Instructor/IInstructor'

interface InstructorAttributes extends Optional<IInstructor, 'id'> { }

export class Instructor extends Model<IInstructor, InstructorAttributes> implements IInstructor {
    public id?: number | undefined
    public id_tipodocumento?: number | undefined
    public id_pais?: number | undefined
    public numero_documento?: string | undefined
    public apellido_paterno?: string | undefined
    public apellido_materno?: string | undefined
    public nombres?: string | undefined
    public nombre_capitalized?: string | undefined
    public telefono?: string | undefined
    public direccion?: string | undefined
    public email?: string | undefined
    public fecha_nacimiento?: string | undefined
    public sexo?: string | undefined
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
}

Instructor.init({
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
        allowNull: false,
        references: {
            model: Pais,
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
        type: DataTypes.STRING(60),
        allowNull: true
    },
    email: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    fecha_nacimiento: {
        type: DataTypes.STRING(12),
        allowNull: true
    },
    sexo: {
        type: DataTypes.CHAR(1),
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
    modelName: 'Instructor',
    tableName: 'instructor',
    sequelize,
    timestamps: true,
    freezeTableName: true
})

// Instructor.belongsTo(TipoDocumento, { foreignKey: 'id_tipodocumento' })

// Instructor.belongsTo(Pais, { foreignKey: 'id_pais' })

// export default Instructor