import { Request, Response } from 'express'
import DocumentoService from '../services/documento.service'

class DocumentoController {
    async getDocumentoInfo(req: Request, res: Response) {
        const { idtipodoc, numdoc } = req.params

        const response = await DocumentoService.getDocumentoInfo(+idtipodoc, numdoc)

        const { result, status } = response

        if (result) {
            res.status(200).json(response)
        } else {
            if (status === 500) {
                res.status(500).json(response)
            } else {
                res.status(404).json(response)
            }
        }
    }
}

export default new DocumentoController()