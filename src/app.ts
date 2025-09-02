import express from 'express'
import cors from 'cors'
import path from 'path'

import alumnoRoutes from './app/routes/alumno.routes'
import tipoDocumentoRoutes from './app/routes/tipoDocumento.routes'
import tipoEventoRoutes from './app/routes/tipoEvento.routes'
import categoriaEventoRoutes from './app/routes/categoriaEvento.routes'
import tipoAdjuntoRoutes from './app/routes/tipoAdjunto.routes'
import grupoAdjuntoRoutes from './app/routes/grupoAdjunto.routes'
import perfilRoutes from './app/routes/perfil.routes'
import trabajadorRoutes from './app/routes/trabajador.routes'
import empresaRoutes from './app/routes/empresa.routes'
import eventoRoutes from './app/routes/evento.routes'
import certificadoRoutes from './app/routes/certificado.routes'
import adjuntoRoutes from './app/routes/adjunto.routes'
import authRoutes from './app/routes/auth.routes'
import cargoRoutes from './app/routes/cargo.routes'
import documentoRoutes from './app/routes/documento.routes'
import personaRoutes from './app/routes/persona.routes'
import usuarioRoutes from './app/routes/usuario.routes'
import reporteRoutes from './app/routes/reporte.routes'
import instructorRoutes from './app/routes/instructor.routes'
import paisRoutes from './app/routes/pais.routes'
import emailRoutes from './app/routes/email.routes'

const app = express()

const allowedOrigin = process.env.CORS_ALLOWED_ORIGIN || '*'

app.use(cors({
    origin: allowedOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use('/uploads', express.static('src/uploads'))

app.use(express.json())

app.use('/img', express.static(path.join(path.resolve(), 'public/img')))

app.use('/api/alumno', alumnoRoutes)
app.use('/api/tipo-documento', tipoDocumentoRoutes)
app.use('/api/tipo-evento', tipoEventoRoutes)
app.use('/api/categoria-evento', categoriaEventoRoutes)
app.use('/api/tipo-adjunto', tipoAdjuntoRoutes)
app.use('/api/grupo-adjunto', grupoAdjuntoRoutes)
app.use('/api/perfil', perfilRoutes)
app.use('/api/trabajador', trabajadorRoutes)
app.use('/api/empresa', empresaRoutes)
app.use('/api/evento', eventoRoutes)
app.use('/api/certificado', certificadoRoutes)
app.use('/api/adjunto', adjuntoRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/cargo', cargoRoutes)
app.use('/api/documento', documentoRoutes)
app.use('/api/persona', personaRoutes)
app.use('/api/usuario', usuarioRoutes)
app.use('/api/reporte', reporteRoutes)
app.use('/api/instructor', instructorRoutes)
app.use('/api/pais', paisRoutes)
app.use('/api/email', emailRoutes)

export default app;