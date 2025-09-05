import { IPais } from "../interfaces/Pais/IPais"
import PaisRepository from "../repositories/Pais/PaisRepository"

class PaisService {
    async getPaises() {
        return await PaisRepository.getAll()
    }

    async getPaisPaginado(page: number, limit: number, estado?: boolean, search?: string) {
        return await PaisRepository.getAllWithPaginate(page, limit, estado, search)
    }

    async getPaisesPorEstado(estado: boolean) {
        return await PaisRepository.getAllByEstado(estado)
    }

    async getPaisPorId(id: number) {
        return await PaisRepository.getById(id)
    }

    async createPais(data: IPais) {
        return await PaisRepository.create(data)
    }

    async updatePais(id: number, data: IPais) {
        return await PaisRepository.update(id, data)
    }

    async updateEstado(id: number, estado: boolean) {
        return await PaisRepository.updateEstado(id, estado)
    }

    async deletePais(id: number) {
        return await PaisRepository.delete(id)
    }
}

export default new PaisService()