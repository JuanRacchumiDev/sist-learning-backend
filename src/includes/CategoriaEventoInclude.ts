import { CategoriaEvento } from "../app/models/categoriaEvento.models";

export const CATEGORIA_EVENTO_INCLUDE = {
    model: CategoriaEvento,
    as: 'categoriaEvento',
    attributes: ['id', 'nombre']
}