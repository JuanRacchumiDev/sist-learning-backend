import DocumentoRepository from "../repositories/Documento/documentoRepository"

class DocumentoService {
    async getDocumentoInfo(idTipoDocumento: number, numeroDocumento: string) {
        return await DocumentoRepository.getInfo(idTipoDocumento, numeroDocumento)
    }
}

export default new DocumentoService()