import { IAlumno } from "../Alumno/IAlumno"
import { IEvento } from "../Evento/IEvento"
import { IPlantilla } from "../Plantilla/IPlantilla"
import { ITipoCertificado } from "../TipoCertificado/ITipoCertificado"

export interface ICertificado {
    id?: number
    id_alumno?: number
    id_evento?: number
    id_tipocertificado?: number
    id_plantilla?: number
    nombre_impresion?: string
    codigo?: string
    codigo_qr?: string
    ruta?: string
    filename?: string
    template_name?: string
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
    tipoCertificado?: ITipoCertificado
    plantilla?: IPlantilla
}

export interface CertificadoResponse {
    result?: boolean
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