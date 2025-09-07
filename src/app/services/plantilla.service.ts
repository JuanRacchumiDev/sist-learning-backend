import { IPlantilla } from "../interfaces/Plantilla/IPlantilla"
import PlantillaRepository from "../repositories/Plantilla/PlantillaRepository"

class PlantillaService {
    async getPlantillas() {
        return await PlantillaRepository.getAll()
    }

    async getPlantillasPaginado(page: number, limit: number, estado?: boolean, search?: string) {
        return await PlantillaRepository.getAllWithPaginate(page, limit, estado, search)
    }

    async getPlantillasPorEstado(estado: boolean) {
        return await PlantillaRepository.getAllByEstado(estado)
    }

    async getPlantillaPorId(id: number) {
        return await PlantillaRepository.getById(id)
    }

    async getPlantillasPorNombre(nombre: string) {
        return await PlantillaRepository.getByNombre(nombre)
    }

    async createPlantilla(data: IPlantilla) {
        return await PlantillaRepository.create(data)
    }

    async updatePlantilla(id: number, data: IPlantilla) {
        return await PlantillaRepository.update(id, data)
    }

    async updateEstado(id: number, estado: boolean) {
        return await PlantillaRepository.updateEstado(id, estado)
    }

    async deletePlantilla(id: number) {
        return await PlantillaRepository.delete(id)
    }
}

export default new PlantillaService() 