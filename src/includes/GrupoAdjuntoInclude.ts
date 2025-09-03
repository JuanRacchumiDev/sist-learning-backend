import { GrupoAdjunto } from "../app/models/grupoAdjunto.models";

export const GRUPO_ADJUNTO_INCLUDE = {
    model: GrupoAdjunto,
    as: 'grupoAdjunto',
    attributes: [
        'id',
        'nombre',
        'nombre_url'
    ]
}