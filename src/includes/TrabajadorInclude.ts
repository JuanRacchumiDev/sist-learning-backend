import { Trabajador } from "../app/models/trabajador.models";

export const TRABAJADOR_INCLUDE = {
    model: Trabajador,
    as: 'trabajador',
    attributes: [
        'id',
        'numero_documento',
        'apellido_paterno',
        'apellido_materno',
        'nombres'
    ]
}