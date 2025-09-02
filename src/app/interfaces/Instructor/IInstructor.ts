import { ITipoDocumento } from '../TipoDocumento/ITipoDocumento'
import { IPais } from '../Pais/IPais'

export interface IInstructor {
    id?: number
    id_tipodocumento?: number
    id_pais?: number
    numero_documento?: string
    apellido_paterno?: string
    apellido_materno?: string
    nombres?: string
    nombre_capitalized?: string
    telefono?: string
    direccion?: string
    email?: string
    fecha_nacimiento?: string
    sexo?: string
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    sistema?: boolean
    estado?: boolean
    tipoDocumento?: ITipoDocumento
    pais?: IPais
}

export interface InstructorResponse {
    result: boolean
    message?: string
    data?: IInstructor | IInstructor[]
    error?: string
    status?: number
}

export interface IInstructorPaginate {
    currentPage: number
    limit: number
    totalPages: number
    totalItems: number
    nextPage: number | null
    previousPage: number | null
}

export interface InstructorResponsePaginate {
    result: boolean
    message?: string
    data?: IInstructor[]
    pagination?: IInstructorPaginate
    error?: string
    status?: number
}