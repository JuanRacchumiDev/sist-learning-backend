import { UsuarioResponse } from "../../interfaces/Usuario/IUsuario"
import { AuthResponse, IAuth } from "../../interfaces/Auth/IAuth"
import { LogSesion } from "../../models/logSesion.models";
import { Usuario } from "../../models/usuario.models"
import { Perfil } from "../../models/perfil.models"
import { Alumno } from "../../models/alumno.models"
import { Instructor } from "../../models/instructor.models"
import { Trabajador } from "../../models/trabajador.models"
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

class AuthRepository {
    async login(data: IAuth): Promise<AuthResponse> {
        try {
            const { username, password, user_agent } = data

            const usuario = await Usuario.findOne({
                where: { username, estado: true },
                include: [
                    { model: Perfil, as: 'perfil' },
                    { model: Alumno, as: 'alumno' },
                    { model: Instructor, as: 'instructor' },
                    { model: Trabajador, as: 'trabajador' }
                ]
            })

            if (!usuario) {
                return { result: false, message: 'Usuario no encontrado o inactivo', status: 404 }
            }

            // Validar contraseña
            const isPasswordValid = await bcrypt.compare(password as string, usuario.password as string);
            if (!isPasswordValid) {
                return { result: false, message: 'Credenciales inválidas', status: 401 };
            }

            // Generar JWT
            const token = jwt.sign(
                { id: usuario.id, username: usuario.username },
                process.env.JWT_SECRET || 'secret_key',
                { expiresIn: process.env.EXPIRE_TOKEN || '24h' }
            );

            // Actualizar usuario con el nuevo token
            await usuario.update({
                token,
                fecha_sesion: new Date()
            });

            // Registrar en Bitácora (LogSesion)
            await LogSesion.create({
                token,
                id_usuario: usuario.id,
                fecha_sesion: new Date(),
                user_agent: user_agent
            });

            // Mapear la respuesta para el IAuth (Data que espera el frontend)
            const usuarioAutenticado: IAuth = {
                username: usuario.username,
                perfil: usuario.perfil,
                alumno: usuario.alumno || undefined,
                instructor: usuario.instructor || undefined,
                trabajador: usuario.trabajador || undefined,
                // Agregamos el objeto usuario completo por si el front lo requiere
                usuario: {
                    id: usuario.id,
                    id_perfil: usuario.id_perfil,
                    username: usuario.username,
                    estado: usuario.estado
                }
            };

            return {
                result: true,
                token,
                message: 'Inicio de sesión exitoso',
                data: usuarioAutenticado,
                status: 200
            };

            // let usuarioAutenticado: IAuth = {}

            // const { username, password, user_agent } = data

            // const dataUsername = username as string
            // const dataPassword = password as string
            // const dataUserAgent = user_agent as string

            // const usuario = await Usuario.findOne(
            //     {
            //         where: {
            //             username: dataUsername
            //         }
            //     }
            // )

            // if (!usuario) {
            //     return { result: false, data: [], message: 'Usuario no encontrado', status: 404 }
            // }

            // const dataUsuario = usuario as IUsuario

            // console.log({ usuario })

            // console.log({ dataUsuario })

            // return { result: false, data: [], message: 'Error de inicio de sesión', status: 500 }

            // const {
            //     id,
            //     id_perfil,
            //     id_trabajador,
            //     id_alumno,
            //     id_instructor,
            // } = getUsuario

            // usuarioAutenticado.id_perfil = id_perfil as number
            // usuarioAutenticado.id_trabajador = id_trabajador as number
            // usuarioAutenticado.id_alumno = id_alumno as number
            // usuarioAutenticado.id_instructor = id_instructor as number
            // usuarioAutenticado.username = username

            // if (id_perfil) {
            //     const responsePerfil = await PerfilService.getPerfilPorId(id_perfil)

            //     const { data } = responsePerfil

            //     const perfil = data as IPerfil

            //     const { nombre, nombre_url } = perfil

            //     if (perfil) {
            //         usuarioAutenticado.nombre_perfil = nombre
            //         usuarioAutenticado.slug_perfil = nombre_url
            //     }
            // }

            // if (id_alumno && !id_instructor && !id_trabajador) {
            //     const responseAlumno = await AlumnoService.getAlumnoPorId(id_alumno)

            //     const { data } = responseAlumno

            //     const alumno = data as IAlumno

            //     if (alumno) {
            //         const { nombre_capitalized } = alumno
            //         usuarioAutenticado.usuario = nombre_capitalized
            //     }
            // } else if (!id_alumno && id_instructor && !id_trabajador) {
            //     const responseInstructor = await InstructorService.getInstructorPorId(id_instructor)

            //     const { data } = responseInstructor

            //     const instructor = data as IInstructor

            //     if (instructor) {
            //         const { nombre_capitalized } = instructor

            //         usuarioAutenticado.usuario = nombre_capitalized
            //     }
            // } else if (!id_alumno && !id_instructor && id_trabajador) {
            //     const responseTrabajador = await TrabajadorService.getTrabajadorPorId(id_trabajador)

            //     const { data } = responseTrabajador

            //     const trabajador = data as ITrabajador

            //     if (trabajador) {
            //         const { nombres, apellido_paterno, apellido_materno } = trabajador

            //         const nombreCompleto = `${nombres} ${apellido_paterno} ${apellido_materno}`

            //         usuarioAutenticado.usuario = nombreCompleto
            //     }
            // }

            // const isPassword = await bcrypt.compare(dataPassword, getUsuario.password as string)

            // if (!isPassword) {
            //     return { result: false, data: [], message: 'Credenciales inválidas', status: 500 }
            // }

            // const token = jwt.sign(
            //     { id, username },
            //     process.env.JWT_SECRET || '',
            //     { expiresIn: process.env.EXPIRE_TOKEN }
            // )

            // // Actualizar el token y la fecha de inicio de sesión
            // const updatedUsuario = await getUsuario.update(
            //     {
            //         token,
            //         fecha_sesion: new Date()
            //     }
            // )

            // if (updatedUsuario) {
            //     // Registrar el inicio de sesión en la bitácora
            //     const newSesion = await LogSesion.create(
            //         {
            //             token,
            //             id_usuario: id,
            //             fecha_sesion: new Date(),
            //             user_agent: dataUserAgent
            //         }
            //     )

            //     if (newSesion.id) {
            //         return { result: true, token, message: 'Inicio de sesión exitoso', data: usuarioAutenticado, status: 200 }
            //     }

            //     return { result: false, token: "", message: 'Error de inicio de sesión', data: [], status: 500 }
            // }

            // return { result: false, data: [], message: 'Error de inicio de sesión', status: 500 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async logout(userId: number): Promise<UsuarioResponse> {
        try {
            const usuario = await Usuario.findOne(
                {
                    where: {
                        id: userId
                    }
                }
            )

            if (!usuario) {
                return { result: false, error: 'Usuario no encontrado', status: 404 }
            }

            // Eliminar el token del usuario
            await usuario.update(
                {
                    token: undefined,
                    fecha_sesion: undefined
                }
            )

            return {
                result: true,
                message: 'Sesión cerrada con éxito',
                status: 200
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }
}

export default new AuthRepository()