import { Router } from 'express'
import PlantillaController from '../controllers/plantilla.controller'
import { authToken } from '../middleware/authMiddleware'
// import { upload } from '../../config/multer';

const router = Router()

router.get('/paginate', authToken, PlantillaController.getPlantillasPaginated)
router.get('/', authToken, PlantillaController.getPlantillas)
router.get('/:id', authToken, PlantillaController.getPlantillaPorId)
router.get('/evento/:idEvento', authToken, PlantillaController.getPlantillasPorEvento);
router.get('/tipo-evento/:idTipoEvento', authToken, PlantillaController.getPlantillasPorTipoEvento);
router.patch('/:id', authToken, PlantillaController.updatePlantilla)
router.patch('/cambiar-estado/:id', authToken, PlantillaController.updateEstado)
router.delete('/:id', authToken, PlantillaController.deletePlantilla)

export default router