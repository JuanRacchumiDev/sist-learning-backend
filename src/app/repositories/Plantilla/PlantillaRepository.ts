import { PLANTILLA_ATTRIBUTES } from "../../../constants/PlantillaConstant";
import HString from "../../../helpers/HString";
import { IPlantilla, PlantillaResponse, IPlantillaPaginate, PlantillaResponsePaginate } from "../../interfaces/Plantilla/IPlantilla";
import { Plantilla } from "../../models/plantilla.models";
import HPagination from "../../../helpers/HPagination";
import { Op } from "sequelize";
import { EVENTO_INCLUDE } from "../../..//includes/EventoInclude";

class PlantillaRepository {
    async getAll(): Promise<PlantillaResponse> {
        try {
            const plantillas = await Plantilla.findAll({
                attributes: PLANTILLA_ATTRIBUTES,
                include: [EVENTO_INCLUDE],
                order: [
                    ['nombre', 'ASC']
                ]
            })

            return { result: true, data: plantillas, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getAllWithPaginate(page: number, limit: number, estado?: boolean, search?: string): Promise<PlantillaResponsePaginate> {
        try {
            // Obtenemos los parámetros de consulta
            const offset = HPagination.getOffset(page, limit)

            const whereConditions: any = {}
            if (typeof estado === 'boolean') {
                whereConditions.estado = estado
            }

            if (search) {
                whereConditions[Op.or] = [
                    { nombre: { [Op.like]: `%${search}%` } }
                ]
            }

            const { count, rows } = await Plantilla.findAndCountAll({
                attributes: PLANTILLA_ATTRIBUTES,
                include: [EVENTO_INCLUDE],
                where: whereConditions,
                order: [
                    ['nombre', 'ASC']
                ],
                limit,
                offset
            })

            const totalPages = Math.ceil(count / limit)
            const nextPage = HPagination.getNextPage(page, limit, count)
            const previousPage = HPagination.getPreviousPage(page)

            const pagination: IPlantillaPaginate = {
                currentPage: page,
                limit,
                totalPages,
                totalItems: count,
                nextPage,
                previousPage
            }

            return {
                result: true,
                data: rows,
                pagination,
                status: 200
            }

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getAllByEstado(estado: boolean): Promise<PlantillaResponse> {
        try {
            const plantillas = await Plantilla.findAll({
                where: {
                    estado
                },
                attributes: PLANTILLA_ATTRIBUTES,
                include: [EVENTO_INCLUDE],
                order: [
                    ['nombre', 'ASC']
                ]
            })

            return { result: true, data: plantillas, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getById(id: number): Promise<PlantillaResponse> {
        try {
            const plantilla = await Plantilla.findByPk(id, {
                attributes: PLANTILLA_ATTRIBUTES,
                include: [EVENTO_INCLUDE]
            })

            if (!plantilla) {
                return { result: false, data: [], message: 'Plantilla no encontrada', status: 200 }
            }

            return { result: true, data: plantilla, message: 'Plantilla encontrada', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getByNombre(nombre: string): Promise<PlantillaResponse> {
        try {
            const plantilla = await Plantilla.findOne({
                where: {
                    nombre
                },
                attributes: PLANTILLA_ATTRIBUTES,
                include: [EVENTO_INCLUDE],
                order: [
                    ['nombre', 'ASC']
                ]
            })

            if (!plantilla) {
                return { result: false, data: [], message: 'Plantilla no encontrada', status: 200 }
            }

            return { result: true, data: plantilla, message: 'Plantilla encontrada', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async create(data: IPlantilla): Promise<PlantillaResponse> {
        try {
            const newPlantilla = await Plantilla.create(data as IPlantilla)

            const { id } = newPlantilla

            if (id) {
                return { result: true, message: 'Plantilla registrada con éxito', data: newPlantilla, status: 200 }
            }

            return { result: false, message: 'Error al registrar la plantilla', status: 500 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async update(id: number, data: IPlantilla): Promise<PlantillaResponse> {
        try {
            const plantilla = await Plantilla.findByPk(id)

            if (!plantilla) {
                return { result: false, message: 'Plantilla no encontrada', status: 200 }
            }

            const dataPlantilla: Partial<IPlantilla> = data

            const updatedPlantilla = await plantilla.update(dataPlantilla)

            return { result: true, message: 'Plantilla actualizada con éxito', data: updatedPlantilla, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async updateEstado(id: number, estado: boolean): Promise<PlantillaResponse> {
        try {
            const plantilla = await Plantilla.findByPk(id)

            if (!plantilla) {
                return { result: false, message: 'Plantilla no encontrada', status: 200 }
            }

            plantilla.estado = estado

            await plantilla.save()

            return { result: true, message: 'Estado actualizado con éxito', data: plantilla, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async delete(id: number): Promise<PlantillaResponse> {
        try {
            const plantilla = await Plantilla.findByPk(id);

            if (!plantilla) {
                return { result: false, data: [], message: 'Plantilla no encontrada', status: 200 };
            }

            await plantilla.destroy();

            return { result: true, data: { id }, message: 'Plantilla eliminada correctamente', status: 200 };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 };
        }
    }
}

export default new PlantillaRepository()