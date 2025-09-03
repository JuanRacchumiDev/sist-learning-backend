import { IGrupoAdjunto } from "../interfaces/GrupoAdjunto/IGrupoAdjunto"
import GrupoAdjuntoRepository from "../repositories/GrupoAdjunto/GrupoAdjuntoRepository"

class GrupoAdjuntoService {
    async getGrupos() {
        return await GrupoAdjuntoRepository.getAll()
    }

    async getGruposPaginado(page: number, limit: number, estado?: boolean) {
        return await GrupoAdjuntoRepository.getAllWithPaginate(page, limit, estado)
    }

    async getGruposPorEstado(estado: boolean) {
        return await GrupoAdjuntoRepository.getAllByEstado(estado)
    }

    async getGrupoPorId(id: number) {
        return await GrupoAdjuntoRepository.getById(id)
    }

    async createGrupo(data: IGrupoAdjunto) {
        return await GrupoAdjuntoRepository.create(data)
    }

    async updateGrupo(id: number, data: IGrupoAdjunto) {
        return await GrupoAdjuntoRepository.update(id, data)
    }

    async updateEstado(id: number, estado: boolean) {
        return await GrupoAdjuntoRepository.updateEstado(id, estado)
    }

    async deleteGrupo(id: number) {
        return await GrupoAdjuntoRepository.delete(id)
    }
}

export default new GrupoAdjuntoService()