import { Router } from 'express'
import PersonaController from '../controllers/persona.controller'
import { authToken } from '../middleware/authMiddleware'

const router = Router()

router.get('/paginate', authToken, PersonaController.getPersonasPaginated)
router.get('/', authToken, PersonaController.getPersonas)
router.get('/idtipo/:idtipodoc/numdoc/:numdoc', authToken, PersonaController.getPersonaPorIdTipoAndNumDoc)
router.get('/:id', authToken, PersonaController.getPersonaPorId)
router.post('/', authToken, PersonaController.createPersona)
router.patch('/:id', authToken, PersonaController.updatePersona)
router.delete('/:id', authToken, PersonaController.deletePersona)
router.post('/load-data', PersonaController.loadData)

export default router