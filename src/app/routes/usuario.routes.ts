import { Router } from 'express'
import UsuarioController from '../controllers/usuario.controller'
import { authToken } from '../middleware/authMiddleware'

const router = Router()

router.get('/paginate', authToken, UsuarioController.getUsuariosPaginated)
router.get('/', authToken, UsuarioController.getUsuarios)
router.get('/:id', authToken, UsuarioController.getUsuarioPorId)
router.post('/', authToken, UsuarioController.createUsuario)
router.patch('/:id', authToken, UsuarioController.updateUsuario)
router.patch('/cambiar-estado/:id', authToken, UsuarioController.updateEstado)
router.delete('/:id', authToken, UsuarioController.deleteUsuario)

router.post('/load-data-alumnos', UsuarioController.loadDataAlumnos)

export default router