import { IAlumno } from "../Alumno/IAlumno"
import { IEvento } from "../Evento/IEvento"

export interface ICertificado {
    id?: number
    id_alumno?: number
    id_evento?: number
    nombre_alumno_impresion?: string
    codigo?: string
    codigoQR?: string
    ruta?: string
    fileName?: string
    templateName?: string
    fecha_registro?: Date
    fecha_descarga?: Date
    fecha_envio?: Date
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    firmado?: boolean
    sistema?: boolean
    estado?: boolean
    alumno?: IAlumno
    evento?: IEvento
}

export interface CertificadoResponse {
    result: boolean
    message?: string
    data?: ICertificado | ICertificado[]
    error?: string
    status?: number
}

export interface ICertificadoPaginate {
    currentPage: number
    limit: number
    totalPages: number
    totalItems: number
    nextPage: number | null
    previousPage: number | null
}

export interface CertificadoResponsePaginate {
    result: boolean
    message?: string
    data?: ICertificado[]
    pagination?: ICertificadoPaginate
    error?: string
    status?: number
}