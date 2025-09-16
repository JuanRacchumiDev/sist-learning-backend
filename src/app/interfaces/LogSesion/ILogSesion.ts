import { IUsuario } from "../Usuario/IUsuario"

export interface ILogSesion {
    id?: number
    id_usuario?: number
    token?: string
    fecha_sesion?: Date
    user_agent?: string
    usuario?: IUsuario
}

export interface LogSesionResponse {
    result: boolean
    message?: string
    data?: ILogSesion | ILogSesion[]
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