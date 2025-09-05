import { TipoDocumento } from "../app/models/tipoDocumento.models";

export const TIPO_DOCUMENTO_INCLUDE = {
    model: TipoDocumento,
    as: 'tipoDocumento',
    attributes: ['id', 'nombre', 'abreviatura']
}