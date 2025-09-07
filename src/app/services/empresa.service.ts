import { Empresa } from '../models/empresa.models';
import { IEmpresa, EmpresaResponse } from '../interfaces/Empresa/IEmpresa'
import EmpresaRepository from '../repositories/Empresa/EmpresaRepository';

class EmpresaService {
    async getEmpresas() {
        return await EmpresaRepository.getAll()
    }

    async getEmpresasPaginado(page: number, limit: number, estado?: boolean, search?: string) {
        return await EmpresaRepository.getAllWithPaginate(page, limit, estado, search)
    }

    async getEmpresaById(id: number) {
        return await EmpresaRepository.getById(id)
    }

    async createEmpresa(data: IEmpresa) {
        return await EmpresaRepository.create(data)
    }

    async updateEmpresa(id: number, data: IEmpresa) {
        return await EmpresaRepository.update(id, data)
    }

    async deleteEmpresa(id: number) {
        return await EmpresaRepository.delete(id)
    }
}

export default new EmpresaService() 