import { Plantilla } from "../app/models/plantilla.models";

export const PLANTILLA_INCLUDE = {
    model: Plantilla,
    as: 'plantilla',
    attributes: [
        'id',
        'nombre',
        'file',
        'path'
    ]
}