import { IPerfil } from "../Perfil/IPerfil"
import { ITrabajador } from "../Trabajador/ITrabajador"
import { IInstructor } from "../Instructor/IInstructor"
import { IAlumno } from "../Alumno/IAlumno"

export interface IUsuario {
    id?: number
    id_trabajador?: number | null
    id_instructor?: number | null
    id_alumno?: number | null
    id_perfil?: number
    username?: string
    password?: string
    token?: string
    fecha_sesion?: Date
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    sistema?: boolean
    estado?: boolean
    trabajador?: ITrabajador
    instructor?: IInstructor
    alumno?: IAlumno
    perfil?: IPerfil
}

export interface UsuarioResponse {
    result: boolean
    message?: string
    data?: IUsuario | IUsuario[]
    token?: string
    error?: string
    status?: number
}

export interface IUsuarioPaginate {
    currentPage: number
    limit: number
    totalPages: number
    totalItems: number
    nextPage: number | null
    previousPage: number | null
}

export interface UsuarioResponsePaginate {
    result: boolean
    message?: string
    data?: IUsuario[]
    pagination?: IUsuarioPaginate
    error?: string
    status?: number
}