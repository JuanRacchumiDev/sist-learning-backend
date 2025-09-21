import { Request, Response } from "express";
import { ICertificadoUpload } from "../interfaces/CertificadoUpload/ICertificadoUpload";
import CertificadoUploadService from "../services/certificadoUpload.service"

class CertificadoUploadController {
    async upload(req: Request, res: Response) {
        try {
            const { file, body } = req

            if (!file) {
                res.status(400).json({
                    result: false,
                    data: null,
                    message: 'No se ha agregado ningún archivo',
                    status: 400
                })
                return;
            }

            const {
                id_alumno,
                id_evento,
                id_tipocertificado
            } = body

            const {
                originalname,
                mimetype,
                path,
            } = file

            // console.log({ body })

            // console.log({ file })

            const fileData: ICertificadoUpload = {
                id_alumno,
                id_evento,
                id_tipocertificado,
                file_name: originalname,
                file_type: mimetype,
                file_data: file.buffer,
                file_path: path
            }

            const result = await CertificadoUploadService.upload(fileData)
            res.status(result.status || 201).json(result)
        } catch (error) {
            // next(error)
            console.error('Error inesperado:', error);
            res.status(500).send(error)
        }
    }
}

export default new CertificadoUploadController()