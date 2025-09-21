import { DataTypes, Model, Optional } from "sequelize";
import { ICertificadoUpload } from "../interfaces/CertificadoUpload/ICertificadoUpload";
import { Alumno } from "./alumno.models";
import { Evento } from "./evento.models";
import { TipoCertificado } from "./tipoCertificado.models";
import sequelize from '../../config/database'

interface CertificadoUploadAttributes extends Optional<ICertificadoUpload, 'id'> { }

export class CertificadoUpload extends Model<ICertificadoUpload, CertificadoUploadAttributes> implements ICertificadoUpload {
    public id?: number | undefined;
    public id_alumno?: number | undefined;
    public id_evento?: number | undefined;
    public id_tipocertificado?: number | undefined;
    public codigo?: string | undefined;
    public codigo_qr?: string | undefined;
    public file_name?: string | undefined;
    public file_type?: string | undefined;
    public file_data?: Buffer | undefined;
    public file_path?: string | undefined;
    public user_crea?: string | undefined;
    public user_actualiza?: string | undefined;
    public user_elimina?: string | undefined;
    public sistema?: boolean | undefined;
    public estado?: boolean | undefined;

    // Timestamps
    public readonly createdAt!: Date
    public readonly updatedAt!: Date
    public readonly deletedAt?: Date

    // Asociaciones
    public getAlumno?: () => Promise<Alumno>
    public getEvento?: () => Promise<Evento>
    public getTipoCertificado?: () => Promise<TipoCertificado>
}

CertificadoUpload.init({
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
    codigo: {
        type: DataTypes.STRING(12),
        allowNull: true
    },
    codigo_qr: {
        type: DataTypes.STRING(350),
        allowNull: true
    },
    file_name: {
        type: DataTypes.STRING(200),
        allowNull: false,
        set(value: string) {
            this.setDataValue('file_name', value ? value.trim() : undefined)
        }
    },
    file_type: {
        type: new DataTypes.STRING(20),
        allowNull: false,
        set(value: string) {
            this.setDataValue('file_type', value ? value.trim() : undefined)
        }
    },
    file_data: {
        type: DataTypes.BLOB('long'),
        allowNull: true
    },
    file_path: {
        type: new DataTypes.STRING(100),
        allowNull: false,
        set(value: string) {
            this.setDataValue('file_path', value ? value.trim() : undefined)
        }
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
    modelName: 'CertificadoUpload',
    tableName: 'certificado_upload',
    sequelize,
    timestamps: true,
    freezeTableName: true
})