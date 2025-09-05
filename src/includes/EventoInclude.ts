import { Evento } from "../app/models/evento.models";

export const EVENTO_INCLUDE = {
    model: Evento,
    as: 'evento',
    attributes: [
        'id',
        'titulo',
        'titulo_url'
    ]
}