import { Alumno } from "../app/models/alumno.models";

export const ALUMNO_INCLUDE = {
    model: Alumno,
    as: 'alumno',
    attributes: [
        'id',
        'apellido_paterno',
        'apellido_materno',
        'nombres'
    ]
}