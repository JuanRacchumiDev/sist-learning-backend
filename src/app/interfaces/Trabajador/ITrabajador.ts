import { ICargo } from "../Cargo/ICargo"
import { ITipoDocumento } from "../TipoDocumento/ITipoDocumento"

export interface ITrabajador {
    id?: number
    id_cargo?: number
    id_tipodocumento?: number
    numero_documento?: string
    apellido_paterno?: string
    apellido_materno?: string
    nombres?: string
    telefono?: string
    direccion?: string
    email?: string
    linkedin?: string
    fecha_nacimiento?: string
    biografia?: string
    sexo?: string
    firma?: string
    foto_perfil?: string
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    sistema?: boolean
    estado?: boolean
    cargo?: ICargo
    tipoDocumento?: ITipoDocumento
}

export interface TrabajadorResponse {
    result: boolean
    message?: string
    data?: ITrabajador | ITrabajador[]
    error?: string
    status?: number
}

export interface ITrabajadorPaginate {
    currentPage: number
    limit: number
    totalPages: number
    totalItems: number
    nextPage: number | null
    previousPage: number | null
}

export interface TrabajadorResponsePaginate {
    result: boolean
    message?: string
    data?: ITrabajador[]
    pagination?: ITrabajadorPaginate
    error?: string
    status?: number
}