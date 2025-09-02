import { IEvento } from "../Evento/IEvento"
import { ITrabajador } from "../Trabajador/ITrabajador"

export interface IProgramacion {
    id?: number
    id_trabajador?: number
    id_evento?: number
    descripcion?: string
    enlace?: string
    fecha_inicio?: string
    fecha_final?: string
    fecha_reprograma?: string
    fecha_cancela?: string
    fecha_registro?: string
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    estado?: boolean
    trabajador?: ITrabajador
    evento?: IEvento
}

export interface ProgramacionResponse {
    result: boolean
    message?: string
    data?: IProgramacion | IProgramacion[]
    error?: string
    status?: number
}

export interface ITrabajadorPaginate {
    currentPage: number
    limit: number
    totalPages: number
    totalItems: number
    nextPage: number | null
    previousPage: number | null
}

export interface TrabajadorResponsePaginate {
    result: boolean
    message?: string
    data?: ITrabajador[]
    pagination?: ITrabajadorPaginate
    error?: string
    status?: number
}