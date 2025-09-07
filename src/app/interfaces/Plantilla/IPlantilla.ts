import { IEvento } from "../Evento/IEvento"

export interface IPlantilla {
    id?: number
    id_evento?: number
    nombre?: string
    file?: Buffer
    path?: string
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    estado?: boolean
    evento?: IEvento
}

export interface PlantillaResponse {
    result: boolean
    message?: string
    data?: IPlantilla | IPlantilla[]
    error?: string
    status?: number
}

export interface IPlantillaPaginate {
    currentPage: number
    limit: number
    totalPages: number
    totalItems: number
    nextPage: number | null
    previousPage: number | null
}

export interface PlantillaResponsePaginate {
    result: boolean
    message?: string
    data?: IPlantilla[]
    pagination?: IPlantillaPaginate
    error?: string
    status?: number
}