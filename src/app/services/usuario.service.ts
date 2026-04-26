import { IUsuario } from "../interfaces/Usuario/IUsuario"
import UsuarioRepository from "../repositories/Usuario/UsuarioRepository"

class UsuarioService {
    async getUsuarios() {
        return await UsuarioRepository.getAll()
    }

    async getUsuariosPaginado(page: number, limit: number, estado?: boolean, search?: string) {
        return await UsuarioRepository.getAllWithPaginate(page, limit, estado, search)
    }

    async getUsuariosPorEstado(estado: boolean) {
        return await UsuarioRepository.getAllByEstado(estado)
    }

    async getUsuarioPorId(id: number) {
        return await UsuarioRepository.getById(id)
    }

    async getUsuarioPorIdAlumnoPerfil(id: number, perfil: string) {
        return await UsuarioRepository.getByIdAndPerfil(id, perfil)
    }

    async createUsuario(data: IUsuario) {
        return await UsuarioRepository.create(data)
    }

    async updateUsuario(id: number, data: IUsuario) {
        return await UsuarioRepository.update(id, data)
    }

    async updateEstado(id: number, estado: boolean) {
        return await UsuarioRepository.updateEstado(id, estado)
    }

    async resetPassword(numeroDocumento: string) {
        return await UsuarioRepository.resetPassword(numeroDocumento)
    }

    async deleteUsuario(id: number) {
        return await UsuarioRepository.delete(id)
    }
}

export default new UsuarioService()