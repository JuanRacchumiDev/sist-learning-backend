import { Model, DataTypes, Optional } from 'sequelize'
import sequelize from '../../config/database'
import { TipoEvento } from './tipoEvento.models'
import { CategoriaEvento } from './categoriaEvento.models'
import { Instructor } from './instructor.models'
import { EModalidad } from '../../enums/EModalidad'
import { IEvento } from '../interfaces/Evento/IEvento'

interface EventoCreationAttributes extends Optional<IEvento, 'id'> { }

export class Evento extends Model<IEvento, EventoCreationAttributes> implements IEvento {
    public id?: number | undefined
    public id_parent?: number | undefined
    public id_tipoevento?: number | undefined
    public id_categoriaevento?: number | undefined
    public id_instructor?: number | undefined
    public titulo?: string | undefined
    public titulo_url?: string | undefined
    public descripcion?: string | undefined
    public temario?: string | undefined
    public plantilla_certificado?: string | undefined
    public fecha_inicio?: string | undefined
    public fecha_fin?: string | undefined
    public modalidad?: EModalidad | undefined
    public precio?: number | undefined
    public duracion?: string | undefined
    public capacidad_maxima?: number | undefined
    public user_crea?: string | undefined
    public user_actualiza?: string | undefined
    public user_elimina?: string | undefined
    public estado?: boolean | undefined

    // Timestamps
    public readonly createdAt!: Date
    public readonly updatedAt!: Date
    public readonly deletedAt?: Date

    // Asociaciones
    public getCategoriaEvento?: () => Promise<CategoriaEvento>
    public getTipoEvento?: () => Promise<TipoEvento>
    public getInstructor?: () => Promise<Instructor>
}

Evento.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_parent: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Evento,
            key: 'id'
        }
    },
    id_tipoevento: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: TipoEvento,
            key: 'id'
        }
    },
    id_categoriaevento: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: CategoriaEvento,
            key: 'id'
        }
    },
    id_instructor: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Instructor,
            key: 'id'
        }
    },
    titulo: {
        type: DataTypes.STRING(120),
        allowNull: false
    },
    titulo_url: {
        type: DataTypes.STRING(140),
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING(120),
        allowNull: true
    },
    temario: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    plantilla_certificado: {
        type: DataTypes.STRING(120),
        allowNull: true
    },
    fecha_inicio: {
        type: DataTypes.STRING(12),
        allowNull: true
    },
    fecha_fin: {
        type: DataTypes.STRING(12),
        allowNull: true
    },
    modalidad: {
        type: DataTypes.ENUM(...Object.values(EModalidad)),
        allowNull: false
    },
    precio: {
        type: DataTypes.DOUBLE,
        allowNull: true
    },
    duracion: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    capacidad_maxima: {
        type: DataTypes.INTEGER,
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
    estado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    modelName: 'Evento',
    tableName: 'evento',
    sequelize,
    timestamps: true,
    freezeTableName: true
})