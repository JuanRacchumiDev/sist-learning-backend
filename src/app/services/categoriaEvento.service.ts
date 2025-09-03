import { ICategoriaEvento } from "../interfaces/CategoriaEvento/ICategoriaEvento"
import CategoriaEventoRepository from "../repositories/CategoriaEvento/CategoriaEventoRepository"

class CategoriaEventoService {
    async getCategorias() {
        return await CategoriaEventoRepository.getAll()
    }

    async getCategoriasPaginado(page: number, limit: number, estado?: boolean) {
        return await CategoriaEventoRepository.getAllWithPaginate(page, limit, estado)
    }

    async getCategoriasPorEstado(estado: boolean) {
        return await CategoriaEventoRepository.getAllByEstado(estado)
    }

    async getCategoriaPorId(id: number) {
        return await CategoriaEventoRepository.getById(id)
    }

    async createCategoria(data: ICategoriaEvento) {
        return await CategoriaEventoRepository.create(data)
    }

    async updateCategoria(id: number, data: ICategoriaEvento) {
        return await CategoriaEventoRepository.update(id, data)
    }

    async deleteCategoria(id: number) {
        return await CategoriaEventoRepository.delete(id)
    }
}

export default new CategoriaEventoService()