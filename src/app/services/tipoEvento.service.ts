import { ITipoEvento } from "../interfaces/TipoEvento/ITipoEvento"
import TipoEventoRepository from "../repositories/TipoEvento/TipoEventoRepository"

class TipoEventoService {
    async getTipos() {
        return await TipoEventoRepository.getAll()
    }

    async getTiposPaginado(page: number, limit: number, estado?: boolean) {
        return await TipoEventoRepository.getAllWithPaginate(page, limit, estado)
    }

    async getTiposPorEstado(estado: boolean) {
        return await TipoEventoRepository.getAllByEstado(estado)
    }

    async getTipoPorId(id: number) {
        return await TipoEventoRepository.getById(id)
    }

    async getTipoPorNombre(nombre: string) {
        return await TipoEventoRepository.getByNombre(nombre)
    }

    async createTipo(data: ITipoEvento) {
        return await TipoEventoRepository.create(data)
    }

    async updateTipo(id: number, data: ITipoEvento) {
        return await TipoEventoRepository.update(id, data)
    }

    async updateEstado(id: number, estado: boolean) {
        return await TipoEventoRepository.updateEstado(id, estado)
    }

    async deleteTipo(id: number) {
        return await TipoEventoRepository.delete(id)
    }
}

export default new TipoEventoService()