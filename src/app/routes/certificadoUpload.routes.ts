import { Router } from 'express'
import CertificadoUploadController from '../controllers/certificadoUpload.controller'
import { authToken } from '../middleware/authMiddleware'
import { upload } from '../../config/multer'

const protectedRouter = Router();

protectedRouter.post('/', authToken, upload.single('file'), CertificadoUploadController.upload)

protectedRouter.get('/busqueda/', authToken, CertificadoUploadController.getCertificadoPorAlumnoPorEvento)

export { protectedRouter }