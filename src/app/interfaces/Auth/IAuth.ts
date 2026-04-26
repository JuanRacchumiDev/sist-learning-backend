import { IAlumno } from "../Alumno/IAlumno"
import { IInstructor } from "../Instructor/IInstructor"
import { IPerfil } from "../Perfil/IPerfil"
import { ITrabajador } from "../Trabajador/ITrabajador"
import { IUsuario } from "../Usuario/IUsuario"

export interface IAuth {
    username?: string
    password?: string
    user_agent?: string
    usuario?: IUsuario
    perfil?: IPerfil
    trabajador?: ITrabajador
    instructor?: IInstructor
    alumno?: IAlumno
    // id_alumno?: number
    // id_instructor?: number
    // id_trabajador?: number
    // id_perfil?: number
    // usuario?: string
    // slug_perfil?: string
    // nombre_perfil?: string
}

export interface AuthResponse {
    result: boolean
    message?: string
    data?: IAuth | IAuth[]
    token?: string
    error?: string
    status?: number
}