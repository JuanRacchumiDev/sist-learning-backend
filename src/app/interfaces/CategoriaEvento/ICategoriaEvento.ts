export interface ICategoriaEvento {
    id?: number
    nombre?: string
    nombre_url?: string
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    sistema?: boolean
    estado?: boolean
}

export interface CategoriaEventoResponse {
    result: boolean
    message?: string
    data?: ICategoriaEvento | ICategoriaEvento[]
    error?: string
    status?: number
}

export interface ICategoriaEventoPaginate {
    currentPage: number
    limit: number
    totalPages: number
    totalItems: number
    nextPage: number | null
    previousPage: number | null
}

export interface CategoriaEventoResponsePaginate {
    result: boolean
    message?: string
    data?: ICategoriaEvento[]
    pagination?: ICategoriaEventoPaginate
    error?: string
    status?: number
}