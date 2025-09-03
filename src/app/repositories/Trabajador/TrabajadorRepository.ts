import { ITrabajador, ITrabajadorPaginate, TrabajadorResponse, TrabajadorResponsePaginate } from "../../interfaces/Trabajador/ITrabajador";
import { Trabajador } from "../../models/trabajador.models"
import { Cargo } from "../../models/cargo.models"
import { TipoDocumento } from "../../models/tipoDocumento.models"
import { TRABAJADOR_ATTRIBUTES } from "../../../constants/TrabajadorConstant";
import { CARGO_INCLUDE } from "../../../includes/CargoInclude";
import { TIPO_DOCUMENTO_INCLUDE } from "../../../includes/TipoDocumentoInclude";
import { PERSONA_ATTRIBUTES } from "../../../constants/PersonaConstant";
import HPagination from "../../../helpers/HPagination";

class TrabajadorRepository {
    async getAll(): Promise<TrabajadorResponse> {
        try {
            const trabajadores = await Trabajador.findAll({
                attributes: TRABAJADOR_ATTRIBUTES,
                include: [
                    CARGO_INCLUDE,
                    TIPO_DOCUMENTO_INCLUDE
                ],
                order: [
                    ['apellido_paterno', 'ASC']
                ]
            })

            return { result: true, data: trabajadores, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getAllWithPaginate(page: number, limit: number, estado?: boolean): Promise<TrabajadorResponsePaginate> {
        try {
            // Obtenemos los parámetros de consulta
            const offset = HPagination.getOffset(page, limit)

            const whereClause = typeof estado === 'boolean' ? { estado } : {}

            const { count, rows } = await Trabajador.findAndCountAll({
                attributes: TRABAJADOR_ATTRIBUTES,
                include: [
                    CARGO_INCLUDE,
                    TIPO_DOCUMENTO_INCLUDE
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

            const pagination: ITrabajadorPaginate = {
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

    async getAllByEstado(estado: boolean): Promise<TrabajadorResponse> {
        try {
            const trabajadores = await Trabajador.findAll({
                where: {
                    estado
                },
                attributes: TRABAJADOR_ATTRIBUTES,
                include: [
                    CARGO_INCLUDE,
                    TIPO_DOCUMENTO_INCLUDE
                ],
                order: [
                    ['apellido_paterno', 'ASC']
                ]
            })

            return { result: true, data: trabajadores, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getById(id: number): Promise<TrabajadorResponse> {
        try {
            const trabajador = await Trabajador.findByPk(id, {
                attributes: TRABAJADOR_ATTRIBUTES,
                include: [
                    CARGO_INCLUDE,
                    TIPO_DOCUMENTO_INCLUDE
                ]
            })

            if (!trabajador) {
                return { result: false, message: 'Trabajador no encontrado', data: [], status: 200 }
            }
            return { result: true, message: 'Trabajador encontrado', data: trabajador, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getByTipoDocNumDoc(idTipoDoc: number, numDoc: string): Promise<TrabajadorResponse> {
        try {
            const trabajador = await Trabajador.findOne({
                where: {
                    id_tipodocumento: idTipoDoc,
                    numero_documento: numDoc
                },
                attributes: TRABAJADOR_ATTRIBUTES,
                include: [
                    CARGO_INCLUDE,
                    TIPO_DOCUMENTO_INCLUDE
                ]
            })

            if (!trabajador) {
                return { result: false, data: [], message: 'Trabajador no encontrado', status: 200 }
            }

            return { result: true, data: trabajador, message: 'Trabajador encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getByNumDoc(numDoc: string): Promise<TrabajadorResponse> {
        try {
            const trabajador = await Trabajador.findOne({
                where: { numero_documento: numDoc },
                attributes: PERSONA_ATTRIBUTES,
                include: [
                    CARGO_INCLUDE,
                    TIPO_DOCUMENTO_INCLUDE
                ]
            })

            if (!trabajador) {
                return { result: false, data: [], message: 'Trabajador no encontrado', status: 200 }
            }

            return { result: true, data: trabajador, message: 'Trabajador encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async create(data: ITrabajador): Promise<TrabajadorResponse> {
        try {
            const newTrabajador = await Trabajador.create(data as ITrabajador)

            const { id } = newTrabajador

            if (id) {
                return { result: true, message: 'Trabajador registrado con éxito', data: newTrabajador, status: 200 }
            }

            return { result: true, message: 'Error al registrar el trabajador', data: [], status: 500 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async update(id: number, data: ITrabajador): Promise<TrabajadorResponse> {
        try {
            const trabajador = await Trabajador.findByPk(id)

            if (!trabajador) {
                return { result: false, message: 'Trabajador no encontrado', status: 404 }
            }

            const dataTrabajador: Partial<ITrabajador> = data

            const updatedTrabajador = await trabajador.update(dataTrabajador)

            return { result: true, message: 'Trabajador actualizado con éxito', data: updatedTrabajador, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async updateEstado(id: number, estado: boolean): Promise<TrabajadorResponse> {
        try {
            const trabajador = await Trabajador.findByPk(id)

            if (!trabajador) {
                return { result: false, data: [], message: 'Trabajador no encontrado', status: 200 }
            }

            trabajador.estado = estado
            await trabajador.save()

            return { result: true, message: 'Estado actualizado con éxito', data: trabajador, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async delete(id: number): Promise<TrabajadorResponse> {
        try {
            const trabajador = await Trabajador.findByPk(id);

            if (!trabajador) {
                return { result: false, message: 'Trabajador no encontrado', status: 404 };
            }

            await trabajador.destroy();

            return { result: true, data: { id }, message: 'Trabajador eliminado correctamente', status: 200 };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 };
        }
    }
}

export default new TrabajadorRepository()