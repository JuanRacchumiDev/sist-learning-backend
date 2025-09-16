import { Router } from 'express'
import CertificadoController from '../controllers/certificado.controller'
import { authToken } from '../middleware/authMiddleware'

const publicRouter = Router();
const protectedRouter = Router();

publicRouter.get('/:id', CertificadoController.getCertificadoPorId)
publicRouter.get('/codigo/:codigo', CertificadoController.getCertificadoPorCodigo)
publicRouter.get('/download/:id', CertificadoController.downloadPorId)
publicRouter.post('/load-data', CertificadoController.loadData)

protectedRouter.get('/paginate', authToken, CertificadoController.getCertificadosPaginated)
protectedRouter.get('/codigo/:codigo', authToken, CertificadoController.getCertificadoPorCodigo)
protectedRouter.get('/download/:id', authToken, CertificadoController.downloadPorId)
protectedRouter.get('/download/name/:filename', authToken, CertificadoController.downloadPorFilename)
protectedRouter.get('/', authToken, CertificadoController.getCertificados)
protectedRouter.get('/alumno', authToken, CertificadoController.getCertificadosPorAlumno)
protectedRouter.get('/:id', authToken, CertificadoController.getCertificadoPorId)
protectedRouter.post('/', authToken, CertificadoController.createCertificado)
protectedRouter.patch('/:id', authToken, CertificadoController.updateCertificado)
protectedRouter.patch('/cambiar-estado/:id', authToken, CertificadoController.updateEstado)
protectedRouter.delete('/:id', authToken, CertificadoController.deleteCertificado)

// export default router
export { publicRouter, protectedRouter };