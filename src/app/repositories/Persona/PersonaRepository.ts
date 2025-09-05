import sequelize from "../../../config/database";
import { IPersona, IPersonaPaginate, PersonaResponse, PersonaResponsePaginate } from "../../interfaces/Persona/IPersona";
import { IAlumno } from "../../interfaces/Alumno/IAlumno"
import { Persona } from "../../models/persona.models"
import { TipoDocumento } from "../../models/tipoDocumento.models";
import AlumnoService from "../../services/alumno.service"
import { toZonedTime } from "date-fns-tz";
import { TIPO_DOCUMENTO_INCLUDE } from "../../../includes/TipoDocumentoInclude";
import { PERSONA_ATTRIBUTES } from "../../../constants/PersonaConstant";
import HPagination from "../../../helpers/HPagination";
import { Op } from "sequelize";

class PersonaRepository {
    async getAll(): Promise<PersonaResponse> {
        try {
            const personas = await Persona.findAll({
                attributes: PERSONA_ATTRIBUTES,
                include: [
                    TIPO_DOCUMENTO_INCLUDE
                ],
                order: [
                    ['apellido_paterno', 'ASC']
                ]
            })

            return { result: true, data: personas, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getAllWithPaginate(page: number, limit: number, estado?: boolean, search?: string): Promise<PersonaResponsePaginate> {
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
                    { numero: { [Op.like]: `%${search}%` } },
                    { nombres: { [Op.like]: `%${search}%` } },
                    { apellido_paterno: { [Op.like]: `%${search}%` } },
                    { apellido_materno: { [Op.like]: `%${search}%` } },
                    { nombre_completo: { [Op.like]: `%${search}%` } }
                ]
            }

            const { count, rows } = await Persona.findAndCountAll({
                attributes: PERSONA_ATTRIBUTES,
                include: [
                    TIPO_DOCUMENTO_INCLUDE
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

            const pagination: IPersonaPaginate = {
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

    async getById(id: number): Promise<PersonaResponse> {
        try {
            const persona = await Persona.findByPk(id, {
                attributes: PERSONA_ATTRIBUTES,
                include: [
                    TIPO_DOCUMENTO_INCLUDE
                ],
                order: [
                    ['apellido_paterno', 'ASC']
                ]
            })

            if (!persona) {
                return { result: false, data: [], message: 'Persona no encontrada', status: 200 }
            }

            return { result: true, data: persona, message: 'Persona encontrada', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getByIdTipoDocAndNumDoc(idTipoDoc: number, numDoc: string): Promise<PersonaResponse> {
        try {
            const persona = await Persona.findOne({
                where: {
                    id_tipodocumento: idTipoDoc,
                    numero: numDoc
                },
                attributes: PERSONA_ATTRIBUTES,
                include: [
                    TIPO_DOCUMENTO_INCLUDE
                ]
            })

            if (!persona) {
                return { result: false, data: [], message: 'Persona no encontrada', status: 200 }
            }

            return { result: true, data: persona, message: 'Persona encontrada', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async create(data: IPersona): Promise<PersonaResponse> {
        const t = await sequelize.transaction()

        try {
            const newPersona = await Persona.create(data as IPersona)

            await t.commit()

            const { id } = newPersona

            if (id) {
                return { result: true, message: 'Persona registrada con éxito', data: newPersona, status: 200 }
            }

            return { result: false, error: 'Error al registrar la persona', data: [], status: 500 }
        } catch (error) {
            await t.rollback()

            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            console.log('errorMessage createPersona', errorMessage)
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async update(id: number, data: IPersona): Promise<PersonaResponse> {
        const t = await sequelize.transaction()

        try {
            const persona = await Persona.findByPk(id)

            if (!persona) {
                return { result: false, data: [], message: 'Persona no encontrada', status: 200 }
            }

            const numero_documento = persona.numero
            const nombres = persona.nombres?.trim()
            const apellido_paterno = persona.apellido_paterno?.trim()
            const apellido_materno = persona.apellido_materno?.trim()
            const nombre_completo = persona.nombre_completo?.trim()
            const departamento = persona.departamento?.trim()
            const provincia = persona.provincia?.trim()
            const distrito = persona.distrito?.trim()
            const direccion = persona.direccion?.trim()
            const direccion_completa = persona.direccion_completa?.trim()

            const fechaNacimiento = persona.fecha_nacimiento as string

            const [dia, mes, anio] = fechaNacimiento.split("/")

            const fechaNacimientoStr = `${anio}-${mes}-${dia}`
            const fechaNacimientoDate = toZonedTime(fechaNacimientoStr as string, 'America/Lima')

            // Validamos si existe un alumno con el número de documento
            const responseAlumno = await AlumnoService.getAlumnoPorNumDoc(numero_documento as string)

            const { result, data } = responseAlumno

            const dataAlumno = data as IPersona

            if (result) {
                // Si existe el alumno, actualizamos su información
                const updatedAlumno = await AlumnoService.updateAlumno(dataAlumno.id as number, {
                    ...data,
                    nombres,
                    apellido_paterno,
                    apellido_materno,
                    fecha_nacimiento_str: fechaNacimientoStr,
                    fecha_nacimiento: fechaNacimientoDate
                })

                if (!updatedAlumno.result) {
                    await t.rollback()

                    return { result: false, message: 'Error al actualizar la información del alumno', status: 500 }
                }
            }

            dataAlumno.nombres = nombres
            dataAlumno.apellido_paterno = apellido_paterno
            dataAlumno.apellido_materno = apellido_materno
            dataAlumno.nombre_completo = nombre_completo
            dataAlumno.departamento = departamento
            dataAlumno.provincia = provincia
            dataAlumno.distrito = distrito
            dataAlumno.direccion = direccion
            dataAlumno.direccion_completa = direccion_completa

            // Actualizamos la persona
            const updatedPersona = await persona.update(dataAlumno, { transaction: t })

            await t.commit()

            return { result: true, message: 'Persona actualizada con éxito', data: updatedPersona, status: 200 }
        } catch (error) {
            await t.rollback()

            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';

            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async delete(id: number): Promise<PersonaResponse> {
        try {
            const persona = await Persona.findByPk(id);

            if (!persona) {
                return { result: false, data: [], message: 'Persona no encontrada', status: 200 };
            }

            await persona.destroy();

            return { result: true, data: { id }, message: 'Persona eliminada correctamente', status: 200 };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 };
        }
    }
}

export default new PersonaRepository()