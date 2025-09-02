export interface ITipoAdjunto {
    id?: number
    nombre?: string
    nombre_url?: string
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    estado?: boolean
}

export interface TipoAdjuntoResponse {
    result: boolean
    message?: string
    data?: ITipoAdjunto | ITipoAdjunto[]
    error?: string
    status?: number
}

export interface ITipoAdjuntoPaginate {
    currentPage: number
    limit: number
    totalPages: number
    totalItems: number
    nextPage: number | null
    previousPage: number | null
}

export interface TipoAdjuntoResponsePaginate {
    result: boolean
    message?: string
    data?: ITipoAdjunto[]
    pagination?: ITipoAdjuntoPaginate
    error?: string
    status?: number
}