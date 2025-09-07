import express from 'express'
import cors from 'cors'
import apiRoutes from './app/routes'
import sequelize from './config/database'

import { Adjunto } from './app/models/adjunto.models'
import { Alumno } from './app/models/alumno.models'
import { Cargo } from './app/models/cargo.models'
import { CategoriaEvento } from './app/models/categoriaEvento.models'
import { Certificado } from './app/models/certificado.models'
import { Departamento } from './app/models/departamento.models'
import { Empresa } from './app/models/empresa.models'
import { Evento } from './app/models/evento.models'
import { GrupoAdjunto } from './app/models/grupoAdjunto.models'
import { Instructor } from './app/models/instructor.models'
import { LogSesion } from './app/models/logSesion.models'
import { Matricula } from './app/models/matricula.models'
import { Pais } from './app/models/pais.models'
import { Perfil } from './app/models/perfil.models'
import { Persona } from './app/models/persona.models'
import { Programacion } from './app/models/programacion.models'
import { Temporal } from './app/models/temporal.models'
import { TipoAdjunto } from './app/models/tipoAdjunto.models'
import { TipoDocumento } from './app/models/tipoDocumento.models'
import { TipoEvento } from './app/models/tipoEvento.models'
import { Trabajador } from './app/models/trabajador.models'
import { Usuario } from './app/models/usuario.models'
import { Plantilla } from './app/models/plantilla.models'
import { TipoCertificado } from './app/models/tipoCertificado.models'

const allowedOrigin = process.env.CORS_ALLOWED_ORIGIN || '*'

const app = express();

app.use(express.json());

app.use(express.static('public'))

app.use(cors({
    origin: allowedOrigin,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

const setupDatabase = async () => {
    try {
        Alumno.belongsTo(TipoDocumento, { foreignKey: 'id_tipodocumento', as: 'tipoDocumento' })
        Alumno.belongsTo(Pais, { foreignKey: 'id_pais', as: 'pais' })
        Alumno.belongsTo(Departamento, { foreignKey: 'id_departamento', as: 'departamento' })

        Cargo.hasMany(Trabajador, { foreignKey: 'id_cargo', as: 'trabajadores' })

        CategoriaEvento.hasMany(Evento, { foreignKey: 'id_categoriaevento', as: 'eventos' })

        Certificado.belongsTo(Alumno, { foreignKey: 'id_alumno', as: 'alumno' })
        Certificado.belongsTo(Evento, { foreignKey: 'id_evento', as: 'evento' })
        Certificado.belongsTo(TipoCertificado, { foreignKey: 'id_tipocertificado', as: 'tipoCertificado' })

        Departamento.belongsTo(Pais, { foreignKey: 'id_pais', as: 'pais' })
        Departamento.hasMany(Alumno, { foreignKey: 'id_departamento', as: 'alumnos' })

        Evento.belongsTo(TipoEvento, { foreignKey: 'id_tipoevento', as: 'tipoEvento' })
        Evento.belongsTo(CategoriaEvento, { foreignKey: 'id_categoriaevento', as: 'categoriaEvento' })
        Evento.belongsTo(Instructor, { foreignKey: 'id_instructor', as: 'instructor' })
        Evento.hasMany(Certificado, { foreignKey: 'id_evento', as: 'certificados' })
        Evento.hasMany(Plantilla, { foreignKey: 'id_evento', as: 'plantillas' })

        GrupoAdjunto.hasMany(Adjunto, { foreignKey: 'id_grupoadjunto', as: 'adjuntos' })

        Instructor.belongsTo(TipoDocumento, { foreignKey: 'id_tipodocumento', as: 'tipoDocumento' })
        Instructor.belongsTo(Pais, { foreignKey: 'id_pais', as: 'pais' })

        LogSesion.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' })

        Matricula.belongsTo(Alumno, { foreignKey: 'id_alumno', as: 'alumno' })
        Matricula.belongsTo(Evento, { foreignKey: 'id_evento', as: 'evento' })

        Pais.hasMany(Alumno, { foreignKey: 'id_pais', as: 'alumnos' })
        Pais.hasMany(Instructor, { foreignKey: 'id_pais', as: 'instructores' })

        Plantilla.belongsTo(Evento, { foreignKey: 'id_evento', as: 'evento' })

        Perfil.hasMany(Usuario, { foreignKey: 'id_perfil', as: 'usuarios' })

        Persona.belongsTo(TipoDocumento, { foreignKey: 'id_tipodocumento', as: 'tipoDocumento' })

        Programacion.belongsTo(Trabajador, { foreignKey: 'id_trabajador', as: 'trabajador' })
        Programacion.belongsTo(Evento, { foreignKey: 'id_evento', as: 'evento' })

        Temporal.belongsTo(Evento, { foreignKey: 'id_evento', as: 'evento' })
        Temporal.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' })
        Temporal.belongsTo(Perfil, { foreignKey: 'id_perfil', as: 'perfil' })
        Temporal.belongsTo(TipoDocumento, { foreignKey: 'id_tipodocumento', as: 'tipoDocumento' })

        TipoAdjunto.hasMany(Adjunto, { foreignKey: 'id_tipoadjunto', as: 'adjuntos' })

        TipoCertificado.hasMany(Certificado, { foreignKey: 'id_tipocertificado', as: 'certificados' })

        TipoDocumento.hasMany(Alumno, { foreignKey: 'id_tipodocumento', as: 'alumnos' })
        TipoDocumento.hasMany(Persona, { foreignKey: 'id_tipodocumento', as: 'personas' })
        TipoDocumento.hasMany(Trabajador, { foreignKey: 'id_tipodocumento', as: 'trabajadores' })

        Trabajador.belongsTo(Cargo, { foreignKey: 'id_cargo', as: 'cargo' })
        Trabajador.belongsTo(TipoDocumento, { foreignKey: 'id_tipodocumento', as: 'tipoDocumento' })

        Usuario.belongsTo(Trabajador, { foreignKey: 'id_trabajador', as: 'trabajador' })
        Usuario.belongsTo(Perfil, { foreignKey: 'id_perfil', as: 'perfil' })
        Usuario.belongsTo(Instructor, { foreignKey: 'id_instructor', as: 'instructor' })
        Usuario.belongsTo(Alumno, { foreignKey: 'id_alumno', as: 'alumno' })

        await sequelize.authenticate();
        console.log('Connection to the database has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

setupDatabase();

// Agregamos API rutas principales
app.use('/v1', apiRoutes)

export default app