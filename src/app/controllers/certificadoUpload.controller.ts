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
                id_tipocertificado,
                codigo
            } = body

            const {
                originalname,
                mimetype,
                path,
            } = file

            const fileData: ICertificadoUpload = {
                id_alumno,
                id_evento,
                id_tipocertificado,
                codigo,
                file_name: originalname,
                file_type: mimetype,
                file_data: file.buffer,
                file_path: path
            }

            const result = await CertificadoUploadService.upload(fileData)
            res.status(result.status || 201).json(result)
        } catch (error) {
            console.error('Error inesperado:', error);
            res.status(500).send(error)
        }
    }

    async getCertificadoPorAlumnoPorEvento(req: Request, res: Response) {
        const { id_alumno, id_evento } = req.query

        const idAlumno = Number(id_alumno)

        const idEvento = Number(id_evento)

        const response = await CertificadoUploadService.getCertificadoPorAlumnoPorEvento(+idAlumno, +idEvento)

        const { result, error } = response

        if (result) {
            res.status(200).json(response)
        } else {
            if (error) {
                res.status(500).json(response)
            } else {
                res.status(200).json(response)
            }
        }
    }
}

export default new CertificadoUploadController()