import { Pais } from "../app/models/pais.models";

export const PAIS_INCLUDE = {
    model: Pais,
    as: 'pais',
    attributes: ['id', 'nombre']
}