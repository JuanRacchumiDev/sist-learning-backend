import { CategoriaEvento } from "../../models/categoriaEvento.models"
import { ICategoriaEvento, CategoriaEventoResponse, CategoriaEventoResponsePaginate, ICategoriaEventoPaginate } from '../../interfaces/CategoriaEvento/ICategoriaEvento';
import HString from "../../../helpers/HString"
import { CATEGORIA_EVENTO_ATTRIBUTES } from "../../../constants/CategoriaEventoConstant"
import HPagination from "../../../helpers/HPagination"

class CategoriaEventoRepository {
    async getAll(): Promise<CategoriaEventoResponse> {
        try {
            const categorias = await CategoriaEvento.findAll({
                attributes: CATEGORIA_EVENTO_ATTRIBUTES,
                order: [
                    ['id', 'DESC']
                ]
            })

            return { result: true, data: categorias, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getAllWithPaginate(page: number, limit: number, estado?: boolean): Promise<CategoriaEventoResponsePaginate> {
        try {
            // Obtenemos los parámetros de consulta
            const offset = HPagination.getOffset(page, limit)

            const whereClause = typeof estado === 'boolean' ? { estado } : {}

            const { count, rows } = await CategoriaEvento.findAndCountAll({
                attributes: CATEGORIA_EVENTO_ATTRIBUTES,
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

            const pagination: ICategoriaEventoPaginate = {
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

    async getAllByEstado(estado: boolean): Promise<CategoriaEventoResponse> {
        try {
            const categorias = await CategoriaEvento.findAll({
                where: {
                    estado
                },
                attributes: CATEGORIA_EVENTO_ATTRIBUTES,
                order: [
                    ['id', 'DESC']
                ]
            })

            return { result: true, data: categorias, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getById(id: number): Promise<CategoriaEventoResponse> {
        try {
            const categoria = await CategoriaEvento.findByPk(id, {
                attributes: CATEGORIA_EVENTO_ATTRIBUTES
            })

            if (!categoria) {
                return { result: false, message: 'Categoría no encontrado', data: [], status: 200 }
            }

            return { result: true, message: 'Categoría encontrada', data: categoria, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async create(data: ICategoriaEvento): Promise<CategoriaEventoResponse> {
        try {
            const { nombre } = data

            data.nombre_url = HString.convertToUrlString(nombre as String)

            const newTipo = await CategoriaEvento.create(data as ICategoriaEvento)

            if (newTipo.id) {
                return { result: true, message: 'Categoría registrado con éxito', data: newTipo, status: 200 }
            }

            return { result: false, message: 'Error al registrar la categoría', data: [], status: 500 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async update(id: number, data: ICategoriaEvento): Promise<CategoriaEventoResponse> {
        try {
            const { nombre } = data

            if (nombre) {
                data.nombre_url = HString.convertToUrlString(nombre as string)
            }

            const categoria = await CategoriaEvento.findByPk(id)

            if (!categoria) {
                return { result: false, message: 'Categoría no encontrada', data: [], status: 200 }
            }

            const dataCategoria: Partial<ICategoriaEvento> = data

            const updatedCategoria = await categoria.update(dataCategoria)

            return { result: true, message: 'Categoría actualizada con éxito', data: updatedCategoria, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async delete(id: number): Promise<CategoriaEventoResponse> {
        try {
            const categoria = await CategoriaEvento.findByPk(id);

            if (!categoria) {
                return { result: false, data: [], message: 'Categoría no encontrada', status: 200 };
            }

            await categoria.destroy();

            return { result: true, data: { id }, message: 'Categoría eliminada correctamente', status: 200 };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 };
        }
    }
}

export default new CategoriaEventoRepository()