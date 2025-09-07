import { ITipoEvento } from "../TipoEvento/ITipoEvento"
import { ICategoriaEvento } from "../CategoriaEvento/ICategoriaEvento"
import { IInstructor } from '../Instructor/IInstructor'
import { EModalidad } from "../../../enums/EModalidad"

export interface IEvento {
    id?: number
    id_parent?: number
    id_tipoevento?: number
    id_categoriaevento?: number
    id_instructor?: number
    titulo?: string
    titulo_url?: string
    descripcion?: string
    temario?: string
    plantilla_certificado?: string
    fecha_inicio?: string
    fecha_fin?: string
    modalidad?: EModalidad
    precio?: number
    duracion?: string
    capacidad_maxima?: number
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    estado?: boolean
    tipoEvento?: ITipoEvento
    categoriaEvento?: ICategoriaEvento
    instructor?: IInstructor
}

export interface EventoResponse {
    result: boolean
    message?: string
    data?: IEvento | IEvento[]
    error?: string
    status?: number
}

export interface IEventoPaginate {
    currentPage: number
    limit: number
    totalPages: number
    totalItems: number
    nextPage: number | null
    previousPage: number | null
}

export interface EventoResponsePaginate {
    result: boolean
    message?: string
    data?: IEvento[]
    pagination?: IEventoPaginate
    error?: string
    status?: number
}