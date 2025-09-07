import { Router } from 'express'
import TipoCertificadoController from '../controllers/tipoCertificado.controller'
import { authToken } from '../middleware/authMiddleware'

const router = Router()

router.get('/', authToken, TipoCertificadoController.getTipos)
router.get('/:id', authToken, TipoCertificadoController.getTipoPorId)
router.post('/', authToken, TipoCertificadoController.createTipo)
router.patch('/:id', authToken, TipoCertificadoController.updateTipo)
router.patch('/cambiar-estado/:id', authToken, TipoCertificadoController.updateEstado)
router.delete('/:id', authToken, TipoCertificadoController.deleteTipo)

export default router