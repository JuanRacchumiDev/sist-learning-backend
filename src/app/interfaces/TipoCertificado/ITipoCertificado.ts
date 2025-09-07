export interface ITipoCertificado {
    id?: number
    nombre?: string
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    estado?: boolean
}

export interface TipoCertificadoResponse {
    result: boolean
    message?: string
    data?: ITipoCertificado | ITipoCertificado[]
    error?: string
    status?: number
}

export interface ITipoCertificadoPaginate {
    currentPage: number
    limit: number
    totalPages: number
    totalItems: number
    nextPage: number | null
    previousPage: number | null
}

export interface TipoCertificadoResponsePaginate {
    result: boolean
    message?: string
    data?: ITipoCertificado[]
    pagination?: ITipoCertificadoPaginate
    error?: string
    status?: number
}