import { Moneda } from "../../../enums/EMoneda"
import { IAlumno } from "../Alumno/IAlumno"
import { IEvento } from "../Evento/IEvento"
import { FormaPago } from "../../../enums/EFormaPago"
import { TipoPago } from "../../../enums/ETipoPago"
import { EstadoPago } from "../../../enums/EEstadoPago"
import { ModalidadPago } from "../../../enums/EModalidadPago"

export interface IMatricula {
    id?: number
    id_alumno?: number
    id_evento?: number
    subtotal?: number
    igv?: number
    total?: number
    moneda?: Moneda
    fecha_pago?: string
    forma_pago?: FormaPago
    tipo_pago?: TipoPago
    estado_pago?: EstadoPago
    modalidad_pago?: ModalidadPago
    nro_voucher?: string
    nro_deposito?: string
    imagen_pago?: string
    acuenta?: number
    saldo?: number
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    estado?: boolean
    alumno?: IAlumno
    evento?: IEvento
}

export interface MatriculaResponse {
    result: boolean
    message?: string
    data?: IMatricula | IMatricula[]
    error?: string
    status?: number
}

export interface IMatriculaPaginate {
    currentPage: number
    limit: number
    totalPages: number
    totalItems: number
    nextPage: number | null
    previousPage: number | null
}

export interface MatriculaResponsePaginate {
    result: boolean
    message?: string
    data?: IMatricula[]
    pagination?: IMatriculaPaginate
    error?: string
    status?: number
}