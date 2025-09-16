import { Router } from 'express'
const router = Router()

import alumnoRoutes from './alumno.routes'
import tipoDocumentoRoutes from './tipoDocumento.routes'
import tipoEventoRoutes from './tipoEvento.routes'
import categoriaEventoRoutes from './categoriaEvento.routes'
import tipoAdjuntoRoutes from './tipoAdjunto.routes'
import grupoAdjuntoRoutes from './grupoAdjunto.routes'
import perfilRoutes from './perfil.routes'
import trabajadorRoutes from './trabajador.routes'
import empresaRoutes from './empresa.routes'
import eventoRoutes from './evento.routes'
import { publicRouter, protectedRouter } from './certificado.routes'
import adjuntoRoutes from './adjunto.routes'
import authRoutes from './auth.routes'
import cargoRoutes from './cargo.routes'
import documentoRoutes from './documento.routes'
import personaRoutes from './persona.routes'
import usuarioRoutes from './usuario.routes'
import reporteRoutes from './reporte.routes'
import instructorRoutes from './instructor.routes'
import paisRoutes from './pais.routes'
import plantillaRoutes from './plantilla.routes'
import tipoCertificadoRoutes from './tipoCertificado.routes'
import emailRoutes from './email.routes'

router.use('/alumno', alumnoRoutes)
router.use('/tipo-documento', tipoDocumentoRoutes)
router.use('/tipo-evento', tipoEventoRoutes)
router.use('/categoria-evento', categoriaEventoRoutes)
router.use('/tipo-adjunto', tipoAdjuntoRoutes)
router.use('/grupo-adjunto', grupoAdjuntoRoutes)
router.use('/perfil', perfilRoutes)
router.use('/trabajador', trabajadorRoutes)
router.use('/empresa', empresaRoutes)
router.use('/evento', eventoRoutes)
router.use('/certificado/web', publicRouter)
router.use('/certificado', protectedRouter)
router.use('/adjunto', adjuntoRoutes)
router.use('/auth', authRoutes)
router.use('/cargo', cargoRoutes)
router.use('/documento', documentoRoutes)
router.use('/persona', personaRoutes)
router.use('/usuario', usuarioRoutes)
router.use('/reporte', reporteRoutes)
router.use('/instructor', instructorRoutes)
router.use('/pais', paisRoutes)
router.use('/plantilla', plantillaRoutes)
router.use('/tipo-certificado', tipoCertificadoRoutes)
router.use('/email', emailRoutes)

export default router