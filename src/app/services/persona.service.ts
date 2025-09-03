import { IPersona } from "../interfaces/Persona/IPersona"
import PersonaRepository from "../repositories/Persona/PersonaRepository"

class PersonaService {
    async getPersonas() {
        return await PersonaRepository.getAll()
    }

    async getPersonasPaginado(page: number, limit: number, estado?: boolean) {
        return await PersonaRepository.getAllWithPaginate(page, limit, estado)
    }

    async getPersonaPorId(id: number) {
        return await PersonaRepository.getById(id)
    }

    async getPersonaPorIdTipoDocAndNumDoc(idTipoDoc: number, numDoc: string) {
        return await PersonaRepository.getByIdTipoDocAndNumDoc(idTipoDoc, numDoc)
    }

    async createPersona(data: IPersona) {
        return await PersonaRepository.create(data)
    }

    async updatePersona(id: number, data: IPersona) {
        return await PersonaRepository.update(id, data)
    }

    async deletePersona(id: number) {
        return await PersonaRepository.delete(id)
    }
}

export default new PersonaService() 