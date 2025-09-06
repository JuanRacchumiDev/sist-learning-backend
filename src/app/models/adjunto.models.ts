import { Model, DataTypes, Optional } from 'sequelize'
import sequelize from '../../config/database'
import { TipoAdjunto } from './tipoAdjunto.models'
import { GrupoAdjunto } from './grupoAdjunto.models'
import { Evento } from './evento.models'
import { IAdjunto } from '../interfaces/Adjunto/IAdjunto'

interface AdjuntoCreationAttributes extends Optional<IAdjunto, 'id'> { }

export class Adjunto extends Model<IAdjunto, AdjuntoCreationAttributes> implements IAdjunto {
    public id?: number | undefined
    public id_tipoadjunto?: number | undefined
    public id_grupoadjunto?: number | undefined
    public id_evento?: number | undefined
    public titulo?: string | undefined
    public titulo_url?: string | undefined
    public descripcion?: string | undefined
    public filename?: string | undefined
    public originalname?: string | undefined
    public filepath?: string | undefined
    public mimetype?: string | undefined
    public size?: number | undefined
    public es_descargable?: boolean | undefined
    public es_visible?: boolean | undefined
    public user_crea?: string | undefined
    public user_actualiza?: string | undefined
    public user_elimina?: string | undefined
    public estado?: boolean | undefined

    // Timestamps
    public readonly createdAt!: Date
    public readonly updatedAt!: Date

    // Asociaciones
    public getTipoAdjunto?: () => Promise<TipoAdjunto>
    public getGrupoAdjunto?: () => Promise<GrupoAdjunto>
    public getEvento?: () => Promise<Evento>
}

Adjunto.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_tipoadjunto: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: TipoAdjunto,
            key: 'id'
        }
    },
    id_grupoadjunto: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: GrupoAdjunto,
            key: 'id'
        }
    },
    id_evento: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Evento,
            key: 'id'
        }
    },
    titulo: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    titulo_url: {
        type: DataTypes.STRING(80),
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    filename: {
        type: DataTypes.STRING(120),
        allowNull: false
    },
    originalname: {
        type: DataTypes.STRING(180),
        allowNull: false
    },
    filepath: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    mimetype: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    size: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    es_descargable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    es_visible: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
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
    tableName: 'adjunto',
    modelName: 'Adjunto',
    sequelize,
    timestamps: true,
    freezeTableName: true
})