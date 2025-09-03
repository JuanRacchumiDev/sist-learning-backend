import { TipoAdjunto } from "../app/models/tipoAdjunto.models";

export const TIPO_ADJUNTO_INCLUDE = {
    model: TipoAdjunto,
    as: 'tipoAdjunto',
    attributes: [
        'id',
        'nombre',
        'nombre_url'
    ]
}