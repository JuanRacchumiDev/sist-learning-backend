import HString from "../../../helpers/HString";
import { IAlumno, AlumnoResponse, AlumnoResponsePaginate, IAlumnoPaginate } from "../../interfaces/Alumno/IAlumno";
import { Alumno } from "../../models/alumno.models"
import { Departamento } from "../../models/departamento.models";
import { Pais } from "../../models/pais.models";
import { TipoDocumento } from "../../models/tipoDocumento.models";
import { ALUMNO_ATTRIBUTES } from "../../../constants/AlumnoConstant";
import { TIPO_DOCUMENTO_INCLUDE } from "../../../includes/TipoDocumentoInclude";
import { PAIS_INCLUDE } from "../../../includes/PaisInclude";
import { DEPARTAMENTO_INCLUDE } from "../../../includes/DepartamentoInclude";
import HPagination from "../../../helpers/HPagination";
import { Op } from "sequelize";

class AlumnoRepository {
    async getAll(): Promise<AlumnoResponse> {
        try {
            const alumnos = await Alumno.findAll({
                attributes: ALUMNO_ATTRIBUTES,
                include: [
                    TIPO_DOCUMENTO_INCLUDE,
                    PAIS_INCLUDE,
                    DEPARTAMENTO_INCLUDE
                ],
                order: [
                    ['apellido_paterno', 'ASC']
                ]
            })

            return { result: true, data: alumnos, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getAllWithPaginate(page: number, limit: number, estado?: boolean, search?: string): Promise<AlumnoResponsePaginate> {
        try {
            // Obtenemos los parámetros de consulta
            const offset = HPagination.getOffset(page, limit)

            // Construir la cláusula `where` dinámicamente
            const whereConditions: any = {}
            if (typeof estado === 'boolean') {
                whereConditions.estado = estado
            }

            if (search) {
                whereConditions[Op.or] = [
                    { numero_documento: { [Op.like]: `%${search}%` } },
                    { apellido_paterno: { [Op.like]: `%${search}%` } },
                    { apellido_materno: { [Op.like]: `%${search}%` } },
                    { nombres: { [Op.like]: `%${search}%` } },
                    { nombre_capitalized: { [Op.like]: `%${search}%` } }
                ]
            }

            const { count, rows } = await Alumno.findAndCountAll({
                attributes: ALUMNO_ATTRIBUTES,
                include: [
                    TIPO_DOCUMENTO_INCLUDE,
                    PAIS_INCLUDE,
                    DEPARTAMENTO_INCLUDE
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

            const pagination: IAlumnoPaginate = {
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

    async getAllByEstado(estado: boolean): Promise<AlumnoResponse> {
        try {
            const alumnos = await Alumno.findAll({
                where: {
                    estado
                },
                attributes: ALUMNO_ATTRIBUTES,
                include: [
                    TIPO_DOCUMENTO_INCLUDE,
                    PAIS_INCLUDE,
                    DEPARTAMENTO_INCLUDE
                ],
                order: [
                    ['apellido_paterno', 'ASC']
                ]
            })

            return { result: true, data: alumnos, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getById(id: number): Promise<AlumnoResponse> {
        try {
            const alumno = await Alumno.findByPk(id, {
                attributes: ALUMNO_ATTRIBUTES,
                include: [
                    TIPO_DOCUMENTO_INCLUDE,
                    PAIS_INCLUDE,
                    DEPARTAMENTO_INCLUDE
                ]
            })

            if (!alumno) {
                return { result: false, data: [], message: 'Alumno no encontrado', status: 200 }
            }

            return { result: true, data: alumno, message: 'Alumno encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getByTipoDocNumDoc(idTipoDoc: number, numDoc: string): Promise<AlumnoResponse> {
        try {
            const alumno = await Alumno.findOne({
                where: {
                    id_tipodocumento: idTipoDoc,
                    numero_documento: numDoc
                },
                attributes: ALUMNO_ATTRIBUTES,
                include: [
                    TIPO_DOCUMENTO_INCLUDE,
                    PAIS_INCLUDE,
                    DEPARTAMENTO_INCLUDE
                ]
            })

            if (!alumno) {
                return { result: false, data: [], message: 'Alumno no encontrado', status: 200 }
            }

            return { result: true, data: alumno, message: 'Alumno encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getByNumDoc(numDoc: string): Promise<AlumnoResponse> {
        try {
            const alumno = await Alumno.findOne({
                where: { numero_documento: numDoc },
                attributes: ALUMNO_ATTRIBUTES,
                include: [
                    TIPO_DOCUMENTO_INCLUDE,
                    PAIS_INCLUDE,
                    DEPARTAMENTO_INCLUDE
                ]
            })

            if (!alumno) {
                return { result: false, data: [], message: 'Alumno no encontrado', status: 200 }
            }

            return { result: true, data: alumno, message: 'Alumno encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async create(data: IAlumno): Promise<AlumnoResponse> {
        const options = {
            timeZone: 'America/Lima',
            hour12: false
        }

        try {
            const {
                nombres,
                apellido_paterno,
                apellido_materno,
                fecha_nacimiento,
                nombre_capitalized,
            } = data

            if (!nombre_capitalized) {
                const nombreCompleto = `${nombres} ${apellido_paterno} ${apellido_materno}`
                const nombreCapitalized = HString.capitalizeNames(nombreCompleto)
                data.nombre_capitalized = nombreCapitalized
            }

            data.apellido_paterno = apellido_paterno?.trim()
            data.apellido_materno = apellido_materno?.trim()
            data.nombres = nombres?.trim()

            const newAlumno = await Alumno.create(data as IAlumno)

            const { id } = newAlumno

            if (id) {
                return { result: true, message: 'Alumno registrado con éxito', data: newAlumno, status: 200 }
            }

            return { result: false, message: 'Error al registrar al alumno', data: [], status: 500 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            console.log('errorMessage', errorMessage)

            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async update(id: number, data: IAlumno): Promise<AlumnoResponse> {
        try {
            const alumno = await Alumno.findByPk(id)

            if (!alumno) {
                return { result: false, data: [], message: 'Alumno no encontrado', status: 200 }
            }

            const fechaNacimiento = (data.fecha_nacimiento == undefined) ? alumno.fecha_nacimiento : data.fecha_nacimiento

            const apellidoPaterno = (data.apellido_paterno === undefined) ? alumno.apellido_paterno?.trim() : data.apellido_paterno?.trim()
            const apellidoMaterno = (data.apellido_materno === undefined) ? alumno.apellido_materno?.trim() : data.apellido_materno?.trim()
            const nombres = (data.nombres === undefined) ? alumno.nombres?.trim() : data.nombres?.trim()

            const nombreCompleto = `${nombres} ${apellidoPaterno} ${apellidoMaterno}`
            const nombreCapitalized = HString.capitalizeNames(nombreCompleto)

            data.apellido_paterno = apellidoPaterno
            data.apellido_materno = apellidoMaterno
            data.nombres = nombres
            data.fecha_nacimiento = fechaNacimiento
            data.nombre_capitalized = nombreCapitalized

            const dataAlumno: Partial<IAlumno> = data

            const updatedAlumno = await alumno.update(dataAlumno)
            return { result: true, message: 'Alumno actualizado con éxito', data: updatedAlumno, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async updateEstado(id: number, estado: boolean): Promise<AlumnoResponse> {
        try {
            const alumno = await Alumno.findByPk(id)

            if (!alumno) {
                return { result: false, data: [], message: 'Alumno no encontrado', status: 200 }
            }

            alumno.estado = estado
            await alumno.save()

            return { result: true, message: 'Estado actualizado con éxito', data: alumno, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async delete(id: number): Promise<AlumnoResponse> {
        try {
            const alumno = await Alumno.findByPk(id);

            if (!alumno) {
                return { result: false, data: [], message: 'Alumno no encontrado', status: 200 };
            }

            await alumno.destroy();

            return { result: true, data: { id }, message: 'Alumno eliminado correctamente', status: 200 };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 };
        }
    }
}

export default new AlumnoRepository()