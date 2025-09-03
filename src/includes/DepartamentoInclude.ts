import { Departamento } from "../app/models/departamento.models";

export const DEPARTAMENTO_INCLUDE = {
    model: Departamento,
    as: 'departamento',
    attributes: ['id', 'nombre']
}