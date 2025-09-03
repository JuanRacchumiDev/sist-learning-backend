import HString from "../../../helpers/HString";
import { IAdjunto, AdjuntoResponse, IAdjuntoPaginate, AdjuntoResponsePaginate } from "../../interfaces/Adjunto/IAdjunto";
import { Adjunto } from "../../models/adjunto.models"
import { Evento } from "../../models/evento.models";
import { TipoAdjunto } from "../../models/tipoAdjunto.models";
import { GrupoAdjunto } from "../../models/grupoAdjunto.models";
import fs from 'fs';
import { ADJUNTO_ATTRIBUTES } from "../../../constants/AdjuntoConstant";
import { TIPO_ADJUNTO_INCLUDE } from "../../../includes/TipoAdjuntoInclude";
import { GRUPO_ADJUNTO_INCLUDE } from "../../../includes/GrupoAdjuntoInclude";
import { EVENTO_INCLUDE } from "../../../includes/EventoInclude";
import HPagination from "../../../helpers/HPagination";

class AdjuntoRepository {
    async getAll(): Promise<AdjuntoResponse> {
        try {
            const adjuntos = await Adjunto.findAll({
                attributes: ADJUNTO_ATTRIBUTES,
                include: [
                    TIPO_ADJUNTO_INCLUDE,
                    GRUPO_ADJUNTO_INCLUDE,
                    EVENTO_INCLUDE
                ],
                order: [
                    ['id', 'DESC']
                ]
            })

            return { result: true, data: adjuntos, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getAllByEstado(estado: boolean): Promise<AdjuntoResponse> {
        try {
            const adjuntos = await Adjunto.findAll({
                where: {
                    estado
                },
                attributes: ADJUNTO_ATTRIBUTES,
                include: [
                    TIPO_ADJUNTO_INCLUDE,
                    GRUPO_ADJUNTO_INCLUDE,
                    EVENTO_INCLUDE
                ],
                order: [
                    ['id', 'DESC']
                ]
            })
            return { result: true, data: adjuntos, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getAllWithPaginate(page: number, limit: number, estado?: boolean): Promise<AdjuntoResponsePaginate> {
        try {
            // Obtenemos los parámetros de consulta
            const offset = HPagination.getOffset(page, limit)

            const whereClause = typeof estado === 'boolean' ? { estado } : {}

            const { count, rows } = await Adjunto.findAndCountAll({
                attributes: ADJUNTO_ATTRIBUTES,
                include: [
                    TIPO_ADJUNTO_INCLUDE,
                    GRUPO_ADJUNTO_INCLUDE,
                    EVENTO_INCLUDE
                ],
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

            const pagination: IAdjuntoPaginate = {
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

    async getById(id: number): Promise<AdjuntoResponse> {
        try {
            const adjunto = await Adjunto.findByPk(id, {
                attributes: ADJUNTO_ATTRIBUTES,
                include: [
                    TIPO_ADJUNTO_INCLUDE,
                    GRUPO_ADJUNTO_INCLUDE,
                    EVENTO_INCLUDE
                ]
            }) as Adjunto

            if (!adjunto) {
                return { result: false, data: [], message: 'Adjunto no encontrado', status: 200 }
            }

            let fileContent: Buffer | null = null

            if (adjunto.filepath) {
                try {
                    // fileContent = await fs.readFile(adjunto.filepath)
                    // adjunto.fil
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
                    return { result: false, error: errorMessage, status: 500 }
                }
            }

            return { result: true, data: adjunto, message: 'Adjunto encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getAllByTipoAdjuntoEvento(idTipoAdjunto: number, idEvento: number): Promise<AdjuntoResponse> {
        try {
            let whereClause: any = {}

            if (idTipoAdjunto) {
                whereClause.id_tipoadjunto = idTipoAdjunto
            }

            if (idEvento) {
                whereClause.id_evento = idEvento
            }

            const adjuntos = await Adjunto.findAll({
                where: whereClause,
                attributes: ADJUNTO_ATTRIBUTES,
                include: [
                    TIPO_ADJUNTO_INCLUDE,
                    GRUPO_ADJUNTO_INCLUDE,
                    EVENTO_INCLUDE
                ],
                order: [
                    ['id', 'DESC']
                ]
            })

            return { result: true, data: adjuntos, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async downloadById(id: number) {
        try {
            const response = await this.getById(id)

            const { result, data, message, error } = response

            if (result && data) {
                const adjunto = data as IAdjunto

                const { filepath, filename } = adjunto

                const path = filepath as string

                const fileName = filename as string

                // Verificar si el archivo existe antes de descargarlo
                if (fs.existsSync(path)) {
                    const result = {
                        result: true,
                        message,
                        outputPath: path,
                        fileName,
                        status: 200
                    }
                    return result
                }

                return { result: false, message: 'Adjunto no encontrado', outputPath: null, fileName: null, status: 200 }
            } else {
                return { result: false, error, outputPath: null, fileName: null, status: 500 }
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async create(data: IAdjunto): Promise<AdjuntoResponse> {
        try {
            const { titulo } = data

            data.titulo_url = HString.convertToUrlString(titulo as String)

            const newAdjunto = await Adjunto.create(data as IAdjunto)

            const { id } = newAdjunto

            if (id) {
                return { result: true, message: 'Adjunto registrado con éxito', data: newAdjunto, status: 200 }
            }

            return { result: false, message: 'Error al registrar el adjunto', data: [], status: 500 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async update(id: number, data: IAdjunto): Promise<AdjuntoResponse> {
        try {
            const { titulo } = data

            if (titulo) {
                data.titulo_url = HString.convertToUrlString(titulo as string)
            }

            const adjunto = await Adjunto.findByPk(id)

            if (!adjunto) {
                return { result: false, message: 'Adjunto no encontrado', data: [], status: 200 }
            }

            const dataAdjunto: Partial<IAdjunto> = data

            const updatedAdjunto = await adjunto.update(dataAdjunto)

            return { result: true, message: 'Adjunto actualizado con éxito', data: updatedAdjunto, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async updateEstado(id: number, estado: boolean): Promise<AdjuntoResponse> {
        try {
            const adjunto = await Adjunto.findByPk(id)

            if (!adjunto) {
                return { result: false, message: 'Adjunto no encontrado', data: [], status: 200 }
            }

            adjunto.estado = estado

            await adjunto.save()

            return { result: true, message: 'Estado actualizado con éxito', data: adjunto, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async delete(id: number): Promise<AdjuntoResponse> {
        try {
            const adjunto = await Adjunto.findByPk(id);

            if (!adjunto) {
                return { result: false, data: [], message: 'Adjunto no encontrado', status: 200 };
            }

            await adjunto.destroy();

            return { result: true, data: { id }, message: 'Adjunto eliminado correctamente', status: 200 };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 };
        }
    }
}

export default new AdjuntoRepository()