import { ICertificado } from "../interfaces/Certificado/ICertificado"
import CertificadoRepository from "../repositories/Certificado/CertificadoRepository"

class CertificadoService {
    async getCertificados() {
        return await CertificadoRepository.getAll()
    }

    async getCertificadosPaginado(page: number, limit: number, estado?: boolean, search?: string) {
        return await CertificadoRepository.getAllWithPaginate(page, limit, estado, search)
    }

    async getCertificadosPorAlumno(idAlumno: number) {
        return await CertificadoRepository.getByAlumnoId(idAlumno)
    }

    async getCertificadoPorCodigo(codigo: string) {
        return await CertificadoRepository.getByCodigo(codigo)
    }

    async getCertificadoPorId(id: number) {
        return await CertificadoRepository.getById(id)
    }

    async getCertificadoPorAlumnoPorEvento(idAlumno: number, idEvento: number) {
        return await CertificadoRepository.getByAlumnoIdEventoId(idAlumno, idEvento)
    }

    async downloadPorId(id: number) {
        return await CertificadoRepository.downloadById(id)
    }

    async downloadPorFilename(filename: string) {
        return await CertificadoRepository.downloadByName(filename)
    }

    async createCertificado(data: ICertificado) {
        return await CertificadoRepository.create(data)
    }

    async updateCertificado(id: number, data: ICertificado) {
        return await CertificadoRepository.update(id, data)
    }

    async updateEstado(id: number, estado: boolean) {
        return await CertificadoRepository.updateEstado(id, estado)
    }

    async deleteCertificado(id: number) {
        return await CertificadoRepository.delete(id)
    }
}

export default new CertificadoService()