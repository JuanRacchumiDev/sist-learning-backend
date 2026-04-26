import { Evento } from "../app/models/evento.models";
import { TipoEvento } from "../app/models/tipoEvento.models"

export const EVENTO_INCLUDE = {
    model: Evento,
    as: 'evento',
    attributes: [
        'id',
        'titulo',
        'titulo_url',
        'fecha_inicio',
        'fecha_fin',
        'id_tipoevento'
    ],
    include: [
        {
            model: TipoEvento,
            as: 'tipoEvento',
            attributes: ['id', 'nombre', 'nombre_url']
        }
    ]
}