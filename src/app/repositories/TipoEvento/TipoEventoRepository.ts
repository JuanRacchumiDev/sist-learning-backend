import { TipoEvento } from '../../models/tipoEvento.models'
import HString from "../../../helpers/HString"
import { ITipoEvento, ITipoEventoPaginate, TipoEventoResponse, TipoEventoResponsePaginate } from "../../interfaces/TipoEvento/ITipoEvento"
import { TIPO_EVENTO_ATTRIBUTES } from '../../../constants/TipoEventoConstant'
import HPagination from '../../../helpers/HPagination'
import { Op } from 'sequelize'

class TipoEventoRepository {
    async getAll(): Promise<TipoEventoResponse> {
        try {
            const tipos = await TipoEvento.findAll({
                attributes: TIPO_EVENTO_ATTRIBUTES,
                order: [
                    ['id', 'DESC']
                ]
            })

            return { result: true, data: tipos, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getAllWithPaginate(page: number, limit: number, estado?: boolean, search?: string): Promise<TipoEventoResponsePaginate> {
        try {
            // Obtenemos los parámetros de consulta
            const offset = HPagination.getOffset(page, limit)

            // const whereClause = typeof estado === 'boolean' ? { estado } : {}
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

            const { count, rows } = await TipoEvento.findAndCountAll({
                attributes: TIPO_EVENTO_ATTRIBUTES,
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

            const pagination: ITipoEventoPaginate = {
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

    async getAllByEstado(estado: boolean): Promise<TipoEventoResponse> {
        try {
            const tipos = await TipoEvento.findAll({
                where: {
                    estado
                },
                attributes: TIPO_EVENTO_ATTRIBUTES,
                order: [
                    ['id', 'DESC']
                ]
            })

            return { result: true, data: tipos, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getById(id: number): Promise<TipoEventoResponse> {
        try {
            const tipo = await TipoEvento.findByPk(id, {
                attributes: TIPO_EVENTO_ATTRIBUTES
            })

            if (!tipo) {
                return { result: false, data: [], message: 'Tipo de evento no encontrado', status: 200 }
            }

            return { result: true, data: tipo, message: 'Tipo de evento encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getByNombre(nombre: string): Promise<TipoEventoResponse> {
        try {
            const tipo = await TipoEvento.findOne({
                where: {
                    nombre
                },
                attributes: TIPO_EVENTO_ATTRIBUTES,
                order: [
                    ['id', 'DESC']
                ]
            })

            if (!tipo) {
                return { result: false, data: [], message: 'Tipo de evento no encontrado', status: 200 }
            }

            return { result: true, data: tipo, message: 'Tipo de evento encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async create(data: ITipoEvento): Promise<TipoEventoResponse> {
        try {
            data.nombre_url = HString.convertToUrlString(data.nombre as String)

            const newTipo = await TipoEvento.create(data as ITipoEvento)

            const { id } = newTipo

            if (id) {
                return { result: true, message: 'Tipo de evento registrado con éxito', data: newTipo, status: 200 }
            }

            return { result: false, message: 'Error al registrar el tipo de evento', data: [], status: 500 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async update(id: number, data: ITipoEvento): Promise<TipoEventoResponse> {
        try {
            if (data.nombre) {
                data.nombre_url = HString.convertToUrlString(data.nombre as String)
            }

            const tipo = await TipoEvento.findByPk(id)

            if (!tipo) {
                return { result: false, data: [], message: 'Tipo de evento no encontrado', status: 200 }
            }

            const dataTipoEvento: Partial<ITipoEvento> = data

            const updatedTipo = await tipo.update(dataTipoEvento)

            return { result: true, data: updatedTipo, message: 'Tipo de evento actualizado con éxito', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async updateEstado(id: number, estado: boolean): Promise<TipoEventoResponse> {
        try {
            const tipo = await TipoEvento.findByPk(id)

            if (!tipo) {
                return { result: false, data: [], message: 'Tipo de evento no encontrado', status: 200 }
            }

            tipo.estado = estado
            await tipo.save()

            return { result: true, data: tipo, message: 'Estado actualizado con éxito', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async delete(id: number): Promise<TipoEventoResponse> {
        try {
            const tipo = await TipoEvento.findByPk(id);

            if (!tipo) {
                return { result: false, data: [], message: 'Tipo de evento no encontrado', status: 200 };
            }

            await tipo.destroy();

            return { result: true, data: { id }, message: 'Tipo de evento eliminado correctamente', status: 200 };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 };
        }
    }
}

export default new TipoEventoRepository()