import { IPerfil } from "../interfaces/Perfil/IPerfil"
import PerfilRepository from "../repositories/Perfil/PerfilRepository"

class PerfilService {
    async getPerfiles() {
        return await PerfilRepository.getAll()
    }

    async getPerfilesPaginado(page: number, limit: number, estado?: boolean) {
        return await PerfilRepository.getAllWithPaginate(page, limit, estado)
    }

    async getPerfilesPorEstado(estado: boolean) {
        return await PerfilRepository.getAllByEstado(estado)
    }

    async getPerfilPorId(id: number) {
        return await PerfilRepository.getById(id)
    }

    async createPerfil(data: IPerfil) {
        return await PerfilRepository.create(data)
    }

    async updatePerfil(id: number, data: IPerfil) {
        return await PerfilRepository.update(id, data)
    }

    async updateEstado(id: number, estado: boolean) {
        return await PerfilRepository.updateEstado(id, estado)
    }

    async deletePerfil(id: number) {
        return await PerfilRepository.delete(id)
    }
}

export default new PerfilService() 