export interface IAuth {
    username?: string
    password?: string
    user_agent?: string
    id_alumno?: number
    id_instructor?: number
    id_trabajador?: number
    id_perfil?: number
    usuario?: string
    slug_perfil?: string
    nombre_perfil?: string
}

export interface AuthResponse {
    result: boolean
    message?: string
    data?: IAuth | IAuth[]
    token?: string
    error?: string
    status?: number
}