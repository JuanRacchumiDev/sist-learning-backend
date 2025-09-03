import { Router } from 'express'
import TipoEventoController from '../controllers/tipoEvento.controller'
import { authToken } from '../middleware/authMiddleware'

const router = Router()

router.get('/paginate', authToken, TipoEventoController.getTiposPaginated)
router.get('/', authToken, TipoEventoController.getTipos)
router.get('/:id', authToken, TipoEventoController.getTipoPorId)
router.get('/nombre/:nombre', authToken, TipoEventoController.getTipoPorNombre)
router.post('/', authToken, TipoEventoController.createTipo)
router.patch('/:id', authToken, TipoEventoController.updateTipo)
router.patch('/cambiar-estado/:id', authToken, TipoEventoController.updateEstado)
router.delete('/:id', authToken, TipoEventoController.deleteTipo)

export default router