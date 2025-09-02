export interface ITipoDocumento {
    id?: number
    nombre?: string
    nombre_url?: string
    abreviatura?: string
    longitud?: number
    en_persona?: boolean
    en_empresa?: boolean
    compra?: boolean
    venta?: boolean
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    sistema?: boolean
    estado?: boolean
}

export interface TipoDocumentoResponse {
    result: boolean
    message?: string
    data?: ITipoDocumento | ITipoDocumento[]
    error?: string
    status?: number
}

export interface ITipoDocumentoPaginate {
    currentPage: number
    limit: number
    totalPages: number
    totalItems: number
    nextPage: number | null
    previousPage: number | null
}

export interface TipoDocumentoResponsePaginate {
    result: boolean
    message?: string
    data?: ITipoDocumento[]
    pagination?: ITipoDocumentoPaginate
    error?: string
    status?: number
}