import { IUsuario, IUsuarioPaginate, UsuarioResponse, UsuarioResponsePaginate } from "../../interfaces/Usuario/IUsuario";
import { Usuario } from "../../models/usuario.models"
import { Trabajador } from "../../models/trabajador.models"
import { Instructor } from "../../models/instructor.models";
import { Alumno } from "../../models/alumno.models";
import { Perfil } from "../../models/perfil.models"
import bcrypt from 'bcryptjs';
import { USUARIO_ATTRIBUTES } from "../../../constants/UsuarioConstant";
import { TRABAJADOR_INCLUDE } from "../../../includes/TrabajadorInclude";
import { INSTRUCTOR_INCLUDE } from "../../../includes/InstructorInclude";
import { ALUMNO_INCLUDE } from "../../../includes/AlumnoInclude";
import { PERFIL_INCLUDE } from "../../../includes/PerfilInclude";
import HPagination from "../../../helpers/HPagination";
import { Op } from "sequelize";

class UsuarioRepository {
    async getAll(): Promise<UsuarioResponse> {
        try {
            const usuarios = await Usuario.findAll({
                attributes: USUARIO_ATTRIBUTES,
                include: [
                    TRABAJADOR_INCLUDE,
                    INSTRUCTOR_INCLUDE,
                    ALUMNO_INCLUDE,
                    PERFIL_INCLUDE
                ],
                order: [
                    ['username', 'ASC']
                ]
            })

            return { result: true, data: usuarios as IUsuario[], status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getAllWithPaginate(page: number, limit: number, estado?: boolean, search?: string): Promise<UsuarioResponsePaginate> {
        try {
            // Obtenemos los parámetros de consulta
            const offset = HPagination.getOffset(page, limit)

            const whereConditions: any = {}

            if (typeof estado === 'boolean') {
                whereConditions.estado = estado
            }

            if (search) {
                whereConditions[Op.or] = [
                    { username: { [Op.like]: `%${search}%` } }
                ]
            }

            const { count, rows } = await Usuario.findAndCountAll({
                attributes: USUARIO_ATTRIBUTES,
                include: [
                    TRABAJADOR_INCLUDE,
                    INSTRUCTOR_INCLUDE,
                    ALUMNO_INCLUDE,
                    PERFIL_INCLUDE
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

            const pagination: IUsuarioPaginate = {
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

    async getAllByEstado(estado: boolean): Promise<UsuarioResponse> {
        try {
            const usuarios = await Usuario.findAll({
                where: {
                    estado
                },
                attributes: USUARIO_ATTRIBUTES,
                include: [
                    TRABAJADOR_INCLUDE,
                    INSTRUCTOR_INCLUDE,
                    ALUMNO_INCLUDE,
                    PERFIL_INCLUDE
                ],
                order: [
                    ['id', 'DESC']
                ]
            })

            return { result: true, data: usuarios as IUsuario[], status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getById(id: number): Promise<UsuarioResponse> {
        try {
            const usuario = await Usuario.findByPk(id, {
                attributes: USUARIO_ATTRIBUTES,
                include: [
                    TRABAJADOR_INCLUDE,
                    INSTRUCTOR_INCLUDE,
                    ALUMNO_INCLUDE,
                    PERFIL_INCLUDE
                ],
            })
            if (!usuario) {
                return { result: false, data: [], message: 'Usuario no encontrado', status: 200 }
            }
            return { result: true, data: usuario as IUsuario, message: 'Usuario encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getByIdAndPerfil(id: number, nombrePerfil: string): Promise<UsuarioResponse> {
        try {
            const perfil = await Perfil.findOne({
                where: {
                    nombre: nombrePerfil
                }
            })

            if (!perfil) {
                return { result: false, data: [], message: 'Perfil no encontrado', status: 200 }
            }

            let whereClause: any = { id_perfil: perfil.id }

            if (nombrePerfil === 'Estudiante') {
                whereClause.id_alumno = id
            } else if (nombrePerfil === 'Instructor') {
                whereClause.id_instructor = id
            } else if (nombrePerfil === 'Administrador') {
                whereClause.id_trabajador = id
            } else {
                return { result: false, data: [], message: 'Perfil no válido', status: 200 }
            }

            const usuario = await Usuario.findOne({
                where: whereClause,
                attributes: USUARIO_ATTRIBUTES,
                include: [
                    TRABAJADOR_INCLUDE,
                    INSTRUCTOR_INCLUDE,
                    ALUMNO_INCLUDE,
                    PERFIL_INCLUDE
                ],
            })
            if (!usuario) {
                return { result: false, data: [], message: 'Usuario no encontrado', status: 200 }
            }
            return { result: true, data: usuario as IUsuario, message: 'Usuario encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async create(data: IUsuario): Promise<UsuarioResponse> {
        try {
            const password = data.password as string

            const hashedPassword = await bcrypt.hash(password, 10)

            data.password = hashedPassword

            const newUsuario = await Usuario.create(data as IUsuario)

            const { id } = newUsuario

            if (id) {
                return { result: true, message: 'Usuario registrado con éxito', data: newUsuario as IUsuario, status: 200 }
            }

            return { result: false, message: 'Error al registrar al usuario', data: [], status: 500 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async update(id: number, data: IUsuario): Promise<UsuarioResponse> {
        try {
            const usuario = await Usuario.findByPk(id)

            if (!usuario) {
                return { result: false, data: [], message: 'Usuario no encontrado', status: 200 }
            }

            const dataUsuario: Partial<IUsuario> = data

            const updatedUsuario = await usuario.update(dataUsuario)

            return { result: true, data: updatedUsuario as IUsuario, message: 'Usuario actualizado con éxito', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async updateEstado(id: number, estado: boolean): Promise<UsuarioResponse> {
        try {
            const usuario = await Usuario.findByPk(id)

            if (!usuario) {
                return { result: false, data: [], message: 'Usuario no encontrado', status: 200 }
            }

            usuario.estado = estado
            await usuario.save()

            return { result: true, data: usuario as IUsuario, message: 'Usuario actualizado con éxito', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async delete(id: number): Promise<UsuarioResponse> {
        try {
            const usuario = await Usuario.findByPk(id);

            if (!usuario) {
                return { result: false, data: [], message: 'Usuario no encontrado', status: 200 };
            }

            await usuario.destroy();

            return { result: true, data: { id }, message: 'Usuario eliminado correctamente', status: 200 };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 };
        }
    }
}

export default new UsuarioRepository()