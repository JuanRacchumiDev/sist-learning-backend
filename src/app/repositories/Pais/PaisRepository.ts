import { Pais } from '../../models/pais.models'
import { IPais, IPaisPaginate, PaisResponse, PaisResponsePaginate } from "../../interfaces/Pais/IPais"
import HString from '../../../helpers/HString'
import { PAIS_ATTRIBUTES } from '../../../constants/PaisConstant'
import HPagination from '../../../helpers/HPagination'

class PaisRepository {
    async getAll(): Promise<PaisResponse> {
        try {
            const paises = await Pais.findAll({
                attributes: PAIS_ATTRIBUTES,
                order: [
                    ['nombre', 'ASC']
                ]
            })

            return { result: true, data: paises, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getAllWithPaginate(page: number, limit: number, estado?: boolean): Promise<PaisResponsePaginate> {
        try {
            // Obtenemos los parámetros de consulta
            const offset = HPagination.getOffset(page, limit)

            const whereClause = typeof estado === 'boolean' ? { estado } : {}

            const { count, rows } = await Pais.findAndCountAll({
                attributes: PAIS_ATTRIBUTES,
                where: whereClause,
                order: [
                    ['id', 'DESC']
                ],
                limit,
                offset
            })

            const totalPages = Math.ceil(count / limit)
            const nextPage = HPagination.getNextPage(page, limit, count)
            const previousPage = HPagination.getPreviousPage(page)

            const pagination: IPaisPaginate = {
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

    async getAllByEstado(estado: boolean): Promise<PaisResponse> {
        try {
            const paises = await Pais.findAll({
                where: {
                    estado
                },
                attributes: PAIS_ATTRIBUTES,
                order: [
                    ['nombre', 'ASC']
                ]
            })

            return { result: true, data: paises, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getById(id: number): Promise<PaisResponse> {
        try {
            const pais = await Pais.findByPk(id, {
                attributes: PAIS_ATTRIBUTES
            })

            if (!pais) {
                return { result: false, data: [], message: 'País no encontrado', status: 200 }
            }

            return { result: true, data: pais, message: 'País encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async create(data: IPais): Promise<PaisResponse> {
        try {
            data.nombre_url = HString.convertToUrlString(data.nombre as string)

            const newPais = await Pais.create(data as IPais)

            const { id } = newPais

            if (id) {
                return { result: true, message: 'País registrado con éxito', data: newPais, status: 200 }
            }

            return { result: false, message: 'Error al registrar el país', data: [], status: 500 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async update(id: number, data: IPais): Promise<PaisResponse> {
        try {
            data.nombre_url = HString.convertToUrlString(data.nombre as string)

            const pais = await Pais.findByPk(id)

            if (!pais) {
                return { result: false, message: 'País no encontrado', data: [], status: 200 }
            }

            const dataPais: Partial<IPais> = data

            const updatedPais = await pais.update(dataPais)

            return { result: true, message: 'País actualizado con éxito', data: updatedPais, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async updateEstado(id: number, estado: boolean): Promise<PaisResponse> {
        try {
            const pais = await Pais.findByPk(id)

            if (!pais) {
                return { result: false, message: 'País no encontrado', data: [], status: 200 }
            }

            pais.estado = estado
            await pais.save()

            return { result: true, message: 'Estado actualizado con éxito', data: pais, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async delete(id: number): Promise<PaisResponse> {
        try {
            const pais = await Pais.findByPk(id);

            if (!pais) {
                return { result: false, data: [], message: 'País no encontrado', status: 200 };
            }

            await pais.destroy();

            return { result: true, data: { id }, message: 'País eliminado correctamente', status: 200 };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 };
        }
    }
}

export default new PaisRepository()