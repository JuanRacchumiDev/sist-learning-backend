import { IPais } from "../Pais/IPais"

export interface IDepartamento {
    id?: number
    id_pais?: number
    nombre?: string
    nombre_url?: string
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    estado?: boolean
    pais?: IPais
}

export interface DepartamentoResponse {
    result: boolean
    message?: string
    data?: IDepartamento | IDepartamento[]
    error?: string
    status?: number
}

export interface IPaisPaginate {
    currentPage: number
    limit: number
    totalPages: number
    totalItems: number
    nextPage: number | null
    previousPage: number | null
}

export interface PaisResponsePaginate {
    result: boolean
    message?: string
    data?: IPais[]
    pagination?: IPaisPaginate
    error?: string
    status?: number
}