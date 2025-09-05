import { Model, DataTypes, Optional } from 'sequelize'
import sequelize from '../../config/database'
import { IPais } from '../interfaces/Pais/IPais';
import { Alumno } from './alumno.models';
import { Instructor } from './instructor.models';

interface PaisAttributes extends Optional<IPais, 'id'> { }

export class Pais extends Model<IPais, PaisAttributes> implements IPais {
    public id?: number | undefined;
    public nombre?: string | undefined;
    public nombre_url?: string | undefined;
    public codigo_postal?: string | undefined;
    public user_crea?: string | undefined;
    public user_actualiza?: string | undefined;
    public user_elimina?: string | undefined;
    public estado?: boolean | undefined;

    // Timestamps
    public readonly createdAt!: Date
    public readonly updatedAt!: Date

    // Asociaciones
    public getAlumnos?: () => Promise<Alumno[]>
    public getInstructores?: () => Promise<Instructor[]>
}

Pais.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    nombre_url: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    codigo_postal: {
        type: DataTypes.STRING(10),
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
    modelName: 'Pais',
    tableName: 'pais',
    sequelize,
    timestamps: true,
    freezeTableName: true
})

// export default Pais