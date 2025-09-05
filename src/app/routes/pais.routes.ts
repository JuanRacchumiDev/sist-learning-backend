import { Router } from 'express'
import PaisController from '../controllers/pais.controller'
import { authToken } from '../middleware/authMiddleware'

const router = Router()

router.get('/paginate', authToken, PaisController.getPaisesPaginated)
router.get('/', authToken, PaisController.getPaises)
router.get('/:id', authToken, PaisController.getPaisPorId)
router.post('/', authToken, PaisController.createPais)
router.patch('/:id', authToken, PaisController.updatePais)
router.patch('/cambiar-estado/:id', authToken, PaisController.updateEstado)
router.delete('/:id', authToken, PaisController.deletePais)

export default router