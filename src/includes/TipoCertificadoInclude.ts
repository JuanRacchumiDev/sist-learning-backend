import { TipoCertificado } from "../app/models/tipoCertificado.models";

export const TIPO_CERTIFICADO_INCLUDE = {
    model: TipoCertificado,
    as: 'tipoCertificado',
    attributes: [
        'id',
        'nombre'
    ]
}