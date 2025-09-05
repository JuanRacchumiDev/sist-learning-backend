import { TipoEvento } from "../app/models/tipoEvento.models";

export const TIPO_EVENTO_INCLUDE = {
    model: TipoEvento,
    as: 'tipoEvento',
    attributes: ['id', 'nombre']
}