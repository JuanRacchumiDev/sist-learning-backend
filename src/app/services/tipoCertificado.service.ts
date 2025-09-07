import { ITipoCertificado } from "../interfaces/TipoCertificado/ITipoCertificado"
import TipoCertificadoRepository from "../repositories/TipoCertificado/TipoCertificadoRepository"

class TipoCertificadoService {
    async getTipos() {
        return await TipoCertificadoRepository.getAll()
    }

    async getTiposPaginado(page: number, limit: number, estado?: boolean, search?: string) {
        return await TipoCertificadoRepository.getAllWithPaginate(page, limit, estado, search)
    }

    async getTiposPorEstado(estado: boolean) {
        return await TipoCertificadoRepository.getAllByEstado(estado)
    }

    async getTipoPorId(id: number) {
        return await TipoCertificadoRepository.getById(id)
    }

    async getTipoPorNombre(nombre: string) {
        return await TipoCertificadoRepository.getByNombre(nombre)
    }

    async createTipo(data: ITipoCertificado) {
        return await TipoCertificadoRepository.create(data)
    }

    async updateTipo(id: number, data: ITipoCertificado) {
        return await TipoCertificadoRepository.update(id, data)
    }

    async updateEstado(id: number, estado: boolean) {
        return await TipoCertificadoRepository.updateEstado(id, estado)
    }

    async deleteTipo(id: number) {
        return await TipoCertificadoRepository.delete(id)
    }
}

export default new TipoCertificadoService()