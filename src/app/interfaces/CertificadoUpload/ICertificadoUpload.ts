import { IAlumno } from "../Alumno/IAlumno"
import { IEvento } from "../Evento/IEvento"
import { ITipoCertificado } from "../TipoCertificado/ITipoCertificado"

export interface ICertificadoUpload {
    id?: number
    id_alumno?: number
    id_evento?: number
    id_tipocertificado?: number
    codigo?: string
    codigo_qr?: string
    file_name?: string
    file_type?: string
    file_data?: Buffer
    file_path?: string
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    sistema?: boolean
    estado?: boolean
    alumno?: IAlumno
    evento?: IEvento
    tipoCertificado?: ITipoCertificado
}

export interface CertificadoUploadResponse {
    result?: boolean
    message?: string
    data?: ICertificadoUpload | ICertificadoUpload[]
    error?: string
    status?: number
}

export interface ICertificadoUploadPaginate {
    currentPage: number
    limit: number
    totalPages: number
    totalItems: number
    nextPage: number | null
    previousPage: number | null
}

export interface CertificadoUploadResponsePaginate {
    result: boolean
    message?: string
    data?: ICertificadoUpload[]
    pagination?: ICertificadoUploadPaginate
    error?: string
    status?: number
}