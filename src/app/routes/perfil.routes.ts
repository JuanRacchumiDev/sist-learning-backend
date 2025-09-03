import { Router } from 'express'
import PerfilController from '../controllers/perfil.controller'
import { authToken } from '../middleware/authMiddleware'

const router = Router()

router.get('/paginate', authToken, PerfilController.getPerfilPaginated)
router.get('/', authToken, PerfilController.getPerfiles)
router.get('/:id', authToken, PerfilController.getPerfilPorId)
router.post('/', authToken, PerfilController.createPerfil)
router.patch('/:id', authToken, PerfilController.updatePerfil)
router.patch('/cambiar-estado/:id', authToken, PerfilController.updateEstado)
router.delete('/:id', authToken, PerfilController.deletePerfil)

export default router