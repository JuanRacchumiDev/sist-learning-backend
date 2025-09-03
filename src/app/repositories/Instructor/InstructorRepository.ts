import { INSTRUCTOR_ATTRIBUTES } from "../../../constants/InstructorConstant";
import HString from "../../../helpers/HString";
import { IInstructor, IInstructorPaginate, InstructorResponse, InstructorResponsePaginate } from "../../interfaces/Instructor/IInstructor";
import { Instructor } from "../../models/instructor.models"
import { TIPO_DOCUMENTO_INCLUDE } from "../../../includes/TipoDocumentoInclude";
import { PAIS_INCLUDE } from "../../../includes/PaisInclude";
import HPagination from "../../../helpers/HPagination";

class InstructorRepository {
    async getAll(): Promise<InstructorResponse> {
        try {
            const instructores = await Instructor.findAll({
                attributes: INSTRUCTOR_ATTRIBUTES,
                include: [
                    TIPO_DOCUMENTO_INCLUDE,
                    PAIS_INCLUDE
                ],
                order: [
                    ['apellido_paterno', 'ASC']
                ]
            })

            return { result: true, data: instructores, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getAllWithPaginate(page: number, limit: number, estado?: boolean): Promise<InstructorResponsePaginate> {
        try {
            // Obtenemos los parámetros de consulta
            const offset = HPagination.getOffset(page, limit)

            const whereClause = typeof estado === 'boolean' ? { estado } : {}

            const { count, rows } = await Instructor.findAndCountAll({
                attributes: INSTRUCTOR_ATTRIBUTES,
                include: [
                    TIPO_DOCUMENTO_INCLUDE,
                    PAIS_INCLUDE
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

            const pagination: IInstructorPaginate = {
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

    async getAllByEstado(estado: boolean): Promise<InstructorResponse> {
        try {
            const instructores = await Instructor.findAll({
                where: {
                    estado
                },
                attributes: INSTRUCTOR_ATTRIBUTES,
                include: [
                    TIPO_DOCUMENTO_INCLUDE,
                    PAIS_INCLUDE
                ],
                order: [
                    ['apellido_paterno', 'ASC']
                ]
            })

            return { result: true, data: instructores, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getById(id: number): Promise<InstructorResponse> {
        try {
            const instructor = await Instructor.findByPk(id, {
                attributes: INSTRUCTOR_ATTRIBUTES,
                include: [
                    TIPO_DOCUMENTO_INCLUDE,
                    PAIS_INCLUDE
                ]
            })

            if (!instructor) {
                return { result: false, data: [], message: 'Instructor no encontrado', status: 200 }
            }

            return { result: true, data: instructor, message: 'Instructor encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getByTipoDocNumDoc(idTipoDoc: number, numDoc: string): Promise<InstructorResponse> {
        try {
            const instructor = await Instructor.findOne({
                where: {
                    id_tipodocumento: idTipoDoc,
                    numero_documento: numDoc
                },
                attributes: INSTRUCTOR_ATTRIBUTES,
                include: [
                    TIPO_DOCUMENTO_INCLUDE,
                    PAIS_INCLUDE
                ]
            })

            if (!instructor) {
                return { result: false, data: [], message: 'Instructor no encontrado', status: 200 }
            }

            return { result: true, data: instructor, message: 'Instructor encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getByNumDoc(numDoc: string): Promise<InstructorResponse> {
        try {
            const instructor = await Instructor.findOne({
                where: { numero_documento: numDoc },
                attributes: INSTRUCTOR_ATTRIBUTES,
                include: [
                    TIPO_DOCUMENTO_INCLUDE,
                    PAIS_INCLUDE
                ]
            })

            if (!instructor) {
                return { result: false, data: [], message: 'Instructor no encontrado', status: 200 }
            }

            return { result: true, data: instructor, message: 'Instructor encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async create(data: IInstructor): Promise<InstructorResponse> {
        try {
            const { nombres, apellido_paterno, apellido_materno } = data

            const nombreCompleto = `${nombres} ${apellido_paterno} ${apellido_materno}`

            const options = {
                timeZone: 'America/Lima',
                hour12: false
            }

            const nombreCapitalized = HString.capitalizeNames(nombreCompleto)

            data.apellido_paterno = apellido_paterno?.trim()
            data.apellido_materno = apellido_materno?.trim()
            data.nombres = nombres?.trim()
            data.nombre_capitalized = nombreCapitalized

            const newInstructor = await Instructor.create(data as IInstructor)

            const { id } = newInstructor

            if (id) {
                return { result: true, message: 'Instructor registrado con éxito', data: newInstructor, status: 200 }
            }

            return { result: false, message: 'Error al registrar al instructor', data: [], status: 500 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async update(id: number, data: IInstructor): Promise<InstructorResponse> {
        try {
            const instructor = await Instructor.findByPk(id)

            if (!instructor) {
                return { result: false, data: [], message: 'Instructor no encontrado', status: 200 }
            }

            const apellidoPaterno = (data.apellido_paterno === undefined) ? instructor.apellido_paterno?.trim() : data.apellido_paterno?.trim()
            const apellidoMaterno = (data.apellido_materno === undefined) ? instructor.apellido_materno?.trim() : data.apellido_materno?.trim()
            const nombres = (data.nombres === undefined) ? instructor.nombres?.trim() : data.nombres?.trim()

            const nombreCompleto = `${nombres} ${apellidoPaterno} ${apellidoMaterno}`
            const nombreCapitalized = HString.capitalizeNames(nombreCompleto)

            data.apellido_paterno = apellidoPaterno
            data.apellido_materno = apellidoMaterno
            data.nombres = nombres
            data.nombre_capitalized = nombreCapitalized

            const dataInstructor: Partial<IInstructor> = data

            const updatedInstructor = await instructor.update(dataInstructor)

            return { result: true, message: 'Instructor actualizado con éxito', data: updatedInstructor, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async updateEstado(id: number, estado: boolean): Promise<InstructorResponse> {
        try {
            const instructor = await Instructor.findByPk(id)

            if (!instructor) {
                return { result: false, data: [], message: 'Instructor no encontrado', status: 200 }
            }

            instructor.estado = estado

            await instructor.save()

            return { result: true, message: 'Estado actualizado con éxito', data: instructor, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async delete(id: number): Promise<InstructorResponse> {
        try {
            const instructor = await Instructor.findByPk(id);

            if (!instructor) {
                return { result: false, data: [], message: 'Instructor no encontrado', status: 200 };
            }

            await instructor.destroy();

            return { result: true, data: { id }, message: 'Instructor eliminado correctamente', status: 200 };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 };
        }
    }
}

export default new InstructorRepository()