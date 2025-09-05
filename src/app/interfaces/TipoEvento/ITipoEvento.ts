export interface ITipoEvento {
    id?: number
    nombre?: string
    nombre_url?: string
    descripcion?: string
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    estado?: boolean
}

export interface TipoEventoResponse {
    result: boolean
    message?: string
    data?: ITipoEvento | ITipoEvento[]
    error?: string
    status?: number
}

export interface ITipoEventoPaginate {
    currentPage: number
    limit: number
    totalPages: number
    totalItems: number
    nextPage: number | null
    previousPage: number | null
}

export interface TipoEventoResponsePaginate {
    result: boolean
    message?: string
    data?: ITipoEvento[]
    pagination?: ITipoEventoPaginate
    error?: string
    status?: number
}