import { Perfil } from "../app/models/perfil.models";

export const PERFIL_INCLUDE = {
    model: Perfil,
    as: 'perfil',
    attributes: [
        'id',
        'nombre'
    ]
}