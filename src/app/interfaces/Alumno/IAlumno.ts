import { ITipoDocumento } from "../TipoDocumento/ITipoDocumento"
import { IPais } from '../Pais/IPais'
import { IDepartamento } from '../Departamento/IDepartamento'

export interface IAlumno {
    id?: number
    id_tipodocumento?: number
    id_pais?: number
    id_departamento?: number
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
    nombre_pais?: string
    nombre_departamento?: string
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    sistema?: boolean
    estado?: boolean
    tipoDocumento?: ITipoDocumento
    pais?: IPais
    departamento?: IDepartamento
}

export interface AlumnoResponse {
    result: boolean
    message?: string
    data?: IAlumno | IAlumno[]
    error?: string
    status?: number
}

export interface IAlumnoPaginate {
    currentPage: number
    limit: number
    totalPages: number
    totalItems: number
    nextPage: number | null
    previousPage: number | null
}

export interface AlumnoResponsePaginate {
    result: boolean
    message?: string
    data?: IAlumno[]
    pagination?: IAlumnoPaginate
    error?: string
    status?: number
}