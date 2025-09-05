export interface ITemporal {
    id?: number
    id_evento?: number
    id_usuario?: number
    id_perfil?: number
    id_tipodocumento?: number
    numero_documento?: string
    nombre_impresion?: string
    fecha_envio?: string
    tabla?: string
}

export interface TemporalResponse {
    result?: boolean
    message?: string
    data?: ITemporal | ITemporal[],
    error?: string
    status?: number
}

export interface ITemporalPaginate {
    currentPage: number
    limit: number
    totalPages: number
    totalItems: number
    nextPage: number | null
    previousPage: number | null
}

export interface TemporalResponsePaginate {
    result: boolean
    message?: string
    data?: ITemporal[]
    pagination?: ITemporalPaginate
    error?: string
    status?: number
}