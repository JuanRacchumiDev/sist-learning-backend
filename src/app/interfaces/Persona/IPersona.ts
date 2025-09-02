import { EOrigen } from "../../../enums/EOrigen"
import { ITipoDocumento } from "../TipoDocumento/ITipoDocumento"

export interface IPersona {
    id?: number
    id_tipodocumento?: number
    numero?: string
    nombres?: string
    apellido_paterno?: string
    apellido_materno?: string
    nombre_completo?: string
    departamento?: string
    provincia?: string
    distrito?: string
    direccion?: string
    direccion_completa?: string
    ubigeo_reniec?: string
    ubigeo_sunat?: string
    ubigeo?: string
    fecha_nacimiento?: string
    estado_civil?: string
    foto?: string
    sexo?: string
    origen?: EOrigen
    sistema?: boolean
    estado?: boolean
    tipoDocumento?: ITipoDocumento
}

export interface PersonaResponse {
    result: boolean
    message?: string
    data?: IPersona | IPersona[]
    error?: string
    status?: number
}

export interface IPersonaPaginate {
    currentPage: number
    limit: number
    totalPages: number
    totalItems: number
    nextPage: number | null
    previousPage: number | null
}

export interface PersonaResponsePaginate {
    result: boolean
    message?: string
    data?: IPersona[]
    pagination?: IPersonaPaginate
    error?: string
    status?: number
}