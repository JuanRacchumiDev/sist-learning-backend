import { Model, DataTypes, Optional } from 'sequelize'
import sequelize from '../../config/database'
import { Trabajador } from './trabajador.models'
import { Instructor } from './instructor.models'
import { Alumno } from './alumno.models'
import { Perfil } from './perfil.models'
import { IUsuario } from '../interfaces/Usuario/IUsuario'

interface UsuarioAttributes extends Optional<IUsuario, 'id'> { }

export class Usuario extends Model<IUsuario, UsuarioAttributes> implements IUsuario {
    public id?: number | undefined
    public id_trabajador?: number | null | undefined
    public id_instructor?: number | null | undefined
    public id_alumno?: number | null | undefined
    public id_perfil?: number | undefined
    public username?: string | undefined
    public password?: string | undefined
    public token?: string | undefined
    public fecha_sesion?: Date | undefined
    public user_crea?: string | undefined
    public user_actualiza?: string | undefined
    public user_elimina?: string | undefined
    public sistema?: boolean | undefined
    public estado?: boolean | undefined

    public readonly perfil?: Perfil;
    public readonly trabajador?: Trabajador;
    public readonly instructor?: Instructor;
    public readonly alumno?: Alumno;

    // Timestamps
    public readonly createdAt!: Date
    public readonly updatedAt!: Date

    // Asociaciones
    public getTrabajador?: () => Promise<Trabajador>
    public getInstructor?: () => Promise<Instructor>
    public getAlumno?: () => Promise<Alumno>
    public getPerfil?: () => Promise<Perfil>
}

Usuario.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_trabajador: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Trabajador,
            key: "id"
        }
    },
    id_instructor: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Instructor,
            key: "id"
        }
    },
    id_alumno: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Alumno,
            key: "id"
        }
    },
    id_perfil: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Perfil,
            key: "id"
        }
    },
    username: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    token: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    fecha_sesion: {
        type: DataTypes.DATE,
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
    modelName: "Usuario",
    tableName: 'usuario',
    sequelize,
    timestamps: true,
    freezeTableName: true
})