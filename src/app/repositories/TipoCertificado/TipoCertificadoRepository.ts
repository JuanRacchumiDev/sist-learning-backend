import { TipoCertificado } from '../../models/tipoCertificado.models'
import HString from "../../../helpers/HString"
import {
    ITipoCertificado,
    ITipoCertificadoPaginate,
    TipoCertificadoResponse,
    TipoCertificadoResponsePaginate
} from "../../interfaces/TipoCertificado/ITipoCertificado"
import { TIPO_CERTIFICADO_ATTRIBUTES } from '../../../constants/TipoCertificadoConstant'
import HPagination from '../../../helpers/HPagination'
import { Op } from 'sequelize'

class TipoCertificadoRepository {
    async getAll(): Promise<TipoCertificadoResponse> {
        try {
            const tipos = await TipoCertificado.findAll({
                attributes: TIPO_CERTIFICADO_ATTRIBUTES,
                order: [
                    ['nombre', 'DESC']
                ]
            })

            return { result: true, data: tipos, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getAllWithPaginate(page: number, limit: number, estado?: boolean, search?: string): Promise<TipoCertificadoResponsePaginate> {
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

            const { count, rows } = await TipoCertificado.findAndCountAll({
                attributes: TIPO_CERTIFICADO_ATTRIBUTES,
                where: whereConditions,
                order: [
                    ['nombre', 'DESC']
                ],
                limit,
                offset
            })

            const totalPages = Math.ceil(count / limit)
            const nextPage = HPagination.getNextPage(page, limit, count)
            const previousPage = HPagination.getPreviousPage(page)

            const pagination: ITipoCertificadoPaginate = {
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

    async getAllByEstado(estado: boolean): Promise<TipoCertificadoResponse> {
        try {
            const tipos = await TipoCertificado.findAll({
                where: {
                    estado
                },
                attributes: TIPO_CERTIFICADO_ATTRIBUTES,
                order: [
                    ['nombre', 'DESC']
                ]
            })

            return { result: true, data: tipos, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getById(id: number): Promise<TipoCertificadoResponse> {
        try {
            const tipo = await TipoCertificado.findByPk(id, {
                attributes: TIPO_CERTIFICADO_ATTRIBUTES
            })

            if (!tipo) {
                return { result: false, data: [], message: 'Tipo de certificado no encontrado', status: 200 }
            }

            return { result: true, data: tipo, message: 'Tipo de certificado encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getByNombre(nombre: string): Promise<TipoCertificadoResponse> {
        try {
            const tipo = await TipoCertificado.findOne({
                where: {
                    nombre
                },
                attributes: TIPO_CERTIFICADO_ATTRIBUTES,
                order: [
                    ['nombre', 'DESC']
                ]
            })

            if (!tipo) {
                return { result: false, data: [], message: 'Tipo de certificado no encontrado', status: 200 }
            }

            return { result: true, data: tipo, message: 'Tipo de certificado encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async create(data: ITipoCertificado): Promise<TipoCertificadoResponse> {
        try {
            const newTipo = await TipoCertificado.create(data as ITipoCertificado)

            const { id } = newTipo

            if (id) {
                return { result: true, message: 'Tipo de certificado registrado con éxito', data: newTipo, status: 200 }
            }

            return { result: false, message: 'Error al registrar el tipo de certificado', data: [], status: 500 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async update(id: number, data: ITipoCertificado): Promise<TipoCertificadoResponse> {
        try {
            const tipo = await TipoCertificado.findByPk(id)

            if (!tipo) {
                return { result: false, data: [], message: 'Tipo de certificado no encontrado', status: 200 }
            }

            const dataTipoCertificado: Partial<ITipoCertificado> = data

            const updatedTipo = await tipo.update(dataTipoCertificado)

            return { result: true, data: updatedTipo, message: 'Tipo de certificado actualizado con éxito', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async updateEstado(id: number, estado: boolean): Promise<TipoCertificadoResponse> {
        try {
            const tipo = await TipoCertificado.findByPk(id)

            if (!tipo) {
                return { result: false, data: [], message: 'Tipo de certificado no encontrado', status: 200 }
            }

            tipo.estado = estado
            await tipo.save()

            return { result: true, data: tipo, message: 'Estado actualizado con éxito', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async delete(id: number): Promise<TipoCertificadoResponse> {
        try {
            const tipo = await TipoCertificado.findByPk(id);

            if (!tipo) {
                return { result: false, data: [], message: 'Tipo de certificado no encontrado', status: 200 };
            }

            await tipo.destroy();

            return { result: true, data: { id }, message: 'Tipo de certificado eliminado correctamente', status: 200 };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 };
        }
    }
}

export default new TipoCertificadoRepository()