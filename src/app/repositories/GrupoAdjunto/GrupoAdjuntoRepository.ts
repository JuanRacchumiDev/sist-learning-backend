import { GrupoAdjunto } from '../../models/grupoAdjunto.models'
import { IGrupoAdjunto, GrupoAdjuntoResponse, GrupoAdjuntoResponsePaginate, IGrupoAdjuntoPaginate } from "../../interfaces/GrupoAdjunto/IGrupoAdjunto"
import { GRUPO_ADJUNTO_ATTRIBUTES } from '../../../constants/GrupoAdjuntoConstant'
import HPagination from '../../../helpers/HPagination'

class GrupoAdjuntoRepository {
    async getAll(): Promise<GrupoAdjuntoResponse> {
        try {
            const grupos = await GrupoAdjunto.findAll({
                attributes: GRUPO_ADJUNTO_ATTRIBUTES,
                order: [
                    ['nombre', 'ASC']
                ]
            })

            return { result: true, data: grupos, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getAllWithPaginate(page: number, limit: number, estado?: boolean): Promise<GrupoAdjuntoResponsePaginate> {
        try {
            // Obtenemos los parámetros de consulta
            const offset = HPagination.getOffset(page, limit)

            const whereClause = typeof estado === 'boolean' ? { estado } : {}

            const { count, rows } = await GrupoAdjunto.findAndCountAll({
                attributes: GRUPO_ADJUNTO_ATTRIBUTES,
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

            const pagination: IGrupoAdjuntoPaginate = {
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

    async getAllByEstado(estado: boolean): Promise<GrupoAdjuntoResponse> {
        try {
            const grupos = await GrupoAdjunto.findAll({
                where: {
                    estado
                },
                attributes: GRUPO_ADJUNTO_ATTRIBUTES,
                order: [
                    ['nombre', 'ASC']
                ]
            })

            return { result: true, data: grupos, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getById(id: number): Promise<GrupoAdjuntoResponse> {
        try {
            const grupo = await GrupoAdjunto.findByPk(id, {
                attributes: GRUPO_ADJUNTO_ATTRIBUTES
            })

            if (!grupo) {
                return { result: false, data: [], message: 'Grupo adjunto no encontrado', status: 200 }
            }

            return { result: true, data: grupo, message: 'Grupo adjunto encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async create(data: IGrupoAdjunto): Promise<GrupoAdjuntoResponse> {
        try {
            const newGrupo = await GrupoAdjunto.create(data as IGrupoAdjunto)

            const { id } = newGrupo

            if (id) {
                return { result: true, message: 'Grupo adjunto registrado con éxito', data: newGrupo, status: 200 }
            }

            return { result: false, message: 'Error al registrar el grupo adjunto', data: [], status: 500 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async update(id: number, data: IGrupoAdjunto): Promise<GrupoAdjuntoResponse> {
        try {
            const grupo = await GrupoAdjunto.findByPk(id)

            if (!grupo) {
                return { result: false, message: 'Grupo adjunto no encontrado', data: [], status: 200 }
            }

            const dataGrupoAdjunto: Partial<IGrupoAdjunto> = data

            const updatedGrupo = await grupo.update(dataGrupoAdjunto)

            return { result: true, message: 'Grupo adjunto actualizado con éxito', data: updatedGrupo, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async updateEstado(id: number, estado: boolean): Promise<GrupoAdjuntoResponse> {
        try {
            const grupoAdjunto = await GrupoAdjunto.findByPk(id)

            if (!grupoAdjunto) {
                return { result: false, message: 'Grupo adjunto no encontrado', data: [], status: 200 }
            }

            grupoAdjunto.estado = estado
            await grupoAdjunto.save()

            return { result: true, message: 'Estado actualizado con éxito', data: grupoAdjunto, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async delete(id: number): Promise<GrupoAdjuntoResponse> {
        try {
            const grupo = await GrupoAdjunto.findByPk(id);

            if (!grupo) {
                return { result: false, data: [], message: 'Grupo adjunto no encontrado', status: 200 };
            }

            await grupo.destroy();

            return { result: true, data: { id }, message: 'Grupo adjunto eliminado correctamente', status: 200 };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 };
        }
    }
}

export default new GrupoAdjuntoRepository()