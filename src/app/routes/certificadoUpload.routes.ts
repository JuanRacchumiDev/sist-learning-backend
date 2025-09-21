import { Router } from 'express'
import CertificadoUploadController from '../controllers/certificadoUpload.controller'
import { authToken } from '../middleware/authMiddleware'
import { upload } from '../../config/multer'

// const publicRouter = Router();
const protectedRouter = Router();

// const router = Router()

protectedRouter.post('/', authToken, upload.single('file'), CertificadoUploadController.upload)

export { protectedRouter }