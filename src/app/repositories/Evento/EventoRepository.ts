import { Evento } from "../../models/evento.models"
import HString from "../../../helpers/HString"
import { IEvento, EventoResponse, EventoResponsePaginate, IEventoPaginate } from "../../interfaces/Evento/IEvento"
import { EVENTO_ATTRIBUTES } from "../../../constants/EventoConstant"
import { TIPO_EVENTO_INCLUDE } from "../../../includes/TipoEventoInclude"
import { CATEGORIA_EVENTO_INCLUDE } from "../../../includes/CategoriaEventoInclude"
import { INSTRUCTOR_INCLUDE } from "../../../includes/InstructorInclude"
import HPagination from "../../../helpers/HPagination"
import { Op } from "sequelize"

class EventoRepository {
    async getAll(): Promise<EventoResponse> {
        try {
            const eventos = await Evento.findAll({
                attributes: EVENTO_ATTRIBUTES,
                include: [
                    TIPO_EVENTO_INCLUDE,
                    CATEGORIA_EVENTO_INCLUDE,
                    INSTRUCTOR_INCLUDE
                ],
                order: [
                    ['id', 'DESC']
                ]
            })

            return { result: true, data: eventos, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getAllWithPaginate(page: number, limit: number, estado?: boolean, search?: string): Promise<EventoResponsePaginate> {
        try {
            const offset = HPagination.getOffset(page, limit)

            const whereConditions: any = {}
            if (typeof estado === 'boolean') {
                whereConditions.estado = estado
            }

            if (search) {
                whereConditions[Op.or] = [
                    { titulo: { [Op.like]: `%${search}%` } },
                    { descripcion: { [Op.like]: `%${search}%` } }
                ]
            }

            const { count, rows } = await Evento.findAndCountAll({
                attributes: EVENTO_ATTRIBUTES,
                include: [
                    TIPO_EVENTO_INCLUDE,
                    CATEGORIA_EVENTO_INCLUDE,
                    INSTRUCTOR_INCLUDE
                ],
                where: whereConditions,
                order: [
                    ['id', 'DESC']
                ],
                limit,
                offset
            })

            const totalPages = Math.ceil(count / limit)
            const nextPage = HPagination.getNextPage(page, limit, count)
            const previousPage = HPagination.getPreviousPage(page)

            const pagination: IEventoPaginate = {
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

    async getAllByEstado(estado: boolean): Promise<EventoResponse> {
        try {
            const eventos = await Evento.findAll({
                where: {
                    estado
                },
                attributes: EVENTO_ATTRIBUTES,
                include: [
                    TIPO_EVENTO_INCLUDE,
                    CATEGORIA_EVENTO_INCLUDE,
                    INSTRUCTOR_INCLUDE
                ],
                order: [
                    ['id', 'DESC']
                ]
            })

            return { result: true, data: eventos, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getById(id: number): Promise<EventoResponse> {
        try {
            const evento = await Evento.findByPk(id, {
                attributes: EVENTO_ATTRIBUTES,
                include: [
                    TIPO_EVENTO_INCLUDE,
                    CATEGORIA_EVENTO_INCLUDE,
                    INSTRUCTOR_INCLUDE
                ]
            })

            if (!evento) {
                return { result: false, data: [], message: 'Evento no encontrado', status: 200 }
            }

            return { result: true, data: evento, message: 'Evento encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getByTitulo(titulo: string): Promise<EventoResponse> {
        try {
            const evento = await Evento.findOne({
                where: {
                    titulo
                },
                attributes: EVENTO_ATTRIBUTES,
                include: [
                    TIPO_EVENTO_INCLUDE,
                    CATEGORIA_EVENTO_INCLUDE,
                    INSTRUCTOR_INCLUDE
                ]
            })

            if (!evento) {
                return { result: false, data: [], message: 'Evento no encontrado', status: 200 }
            }

            return { result: true, data: evento, message: 'Evento encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async create(data: IEvento): Promise<EventoResponse> {
        try {
            const { titulo } = data

            data.titulo_url = HString.convertToUrlString(titulo as String)

            const newEvento = await Evento.create(data as IEvento)

            const { id } = newEvento

            if (id) {
                return { result: true, message: 'Evento registrado con éxito', data: newEvento, status: 200 }
            }

            return { result: false, message: 'Error al registrar el evento', data: [], status: 500 }

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async update(id: number, data: IEvento): Promise<EventoResponse> {
        try {
            const { titulo } = data

            if (titulo) {
                data.titulo_url = HString.convertToUrlString(titulo as String)
            }

            const evento = await Evento.findByPk(id)

            if (!evento) {
                return { result: false, data: [], message: 'Evento no encontrado', status: 200 }
            }

            const dataEvento: Partial<IEvento> = data

            const updatedEvento = await evento.update(dataEvento)

            return { result: true, data: updatedEvento, message: 'Evento actualizado con éxito', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async updateEstado(id: number, estado: boolean): Promise<EventoResponse> {
        try {
            const evento = await Evento.findByPk(id)

            if (!evento) {
                return { result: false, data: [], message: 'Evento no encontrado', status: 200 }
            }

            evento.estado = estado
            evento.save()

            return { result: true, data: evento, message: 'Estado actualizado con éxito', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async delete(id: number): Promise<EventoResponse> {
        try {
            const evento = await Evento.findByPk(id);

            if (!evento) {
                return { result: false, data: [], message: 'Evento no encontrado', status: 200 };
            }

            await evento.destroy();

            return { result: true, data: { id }, message: 'Evento eliminado correctamente', status: 200 };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 };
        }
    }
}

export default new EventoRepository()