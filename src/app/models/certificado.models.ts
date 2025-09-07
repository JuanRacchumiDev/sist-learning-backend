import { Model, DataTypes, Optional } from 'sequelize'
import sequelize from '../../config/database'
import { Alumno } from './alumno.models'
import { Evento } from './evento.models'
import { ICertificado } from '../interfaces/Certificado/ICertificado'
import { TipoCertificado } from './tipoCertificado.models'
import { Plantilla } from './plantilla.models'

interface CertificadoAttributes extends Optional<ICertificado, 'id'> { }

export class Certificado extends Model<ICertificado, CertificadoAttributes> implements ICertificado {
    public id?: number | undefined
    public id_alumno?: number | undefined
    public id_evento?: number | undefined
    public id_tipocertificado?: number | undefined
    public id_plantilla?: number | undefined
    public codigo?: string | undefined
    public codigo_qr?: string | undefined
    public ruta?: string | undefined
    public filename?: string | undefined
    public nombre_impresion?: string | undefined
    public template_name?: string | undefined
    public fecha_registro?: Date | undefined
    public fecha_descarga?: Date | undefined
    public fecha_envio?: Date | undefined
    public user_crea?: string | undefined
    public user_actualiza?: string | undefined
    public user_elimina?: string | undefined
    public sistema?: boolean | undefined
    public estado?: boolean | undefined
}

Certificado.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_alumno: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Alumno,
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
    id_tipocertificado: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: TipoCertificado,
            key: 'id'
        }
    },
    id_plantilla: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Plantilla,
            key: 'id'
        }
    },
    nombre_impresion: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    codigo: {
        type: DataTypes.STRING(12),
        allowNull: true
    },
    codigo_qr: {
        type: DataTypes.STRING(350),
        allowNull: true
    },
    ruta: {
        type: DataTypes.STRING(350),
        allowNull: true
    },
    filename: {
        type: DataTypes.STRING(300),
        allowNull: false
    },
    template_name: {
        type: DataTypes.STRING(120),
        allowNull: true
    },
    fecha_registro: {
        type: DataTypes.DATE,
        allowNull: true
    },
    fecha_descarga: {
        type: DataTypes.DATE,
        allowNull: true
    },
    fecha_envio: {
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
    modelName: 'Certificado',
    tableName: 'certificado',
    sequelize,
    timestamps: true,
    freezeTableName: true
})