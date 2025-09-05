import { TipoDocumento } from '../../models/tipoDocumento.models'
import { ITipoDocumento, TipoDocumentoResponse } from "../../interfaces/TipoDocumento/ITipoDocumento"
import HString from '../../../helpers/HString'
import { TIPO_DOCUMENTO_ATTRIBUTES } from '../../../constants/TipoDocumentoConstant'

class TipoDocumentoRepository {
    async getAll(): Promise<TipoDocumentoResponse> {
        try {
            const tipos = await TipoDocumento.findAll({
                attributes: TIPO_DOCUMENTO_ATTRIBUTES,
                order: [
                    ['nombre', 'ASC']
                ]
            })

            return { result: true, data: tipos, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getAllByEstado(estado: boolean): Promise<TipoDocumentoResponse> {
        try {
            const tipos = await TipoDocumento.findAll({
                where: {
                    estado
                },
                attributes: TIPO_DOCUMENTO_ATTRIBUTES,
                order: [
                    ['nombre', 'ASC']
                ]
            })

            return { result: true, data: tipos, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getAllByCategoria(categoria: string): Promise<TipoDocumentoResponse> {
        try {
            let tipos = null

            if (categoria == 'persona') {
                tipos = await TipoDocumento.findAll({
                    where: {
                        "en_persona": true,
                        "en_empresa": false,
                        "estado": true
                    },
                    attributes: TIPO_DOCUMENTO_ATTRIBUTES,
                    order: [
                        ['nombre', 'ASC']
                    ]
                })
            } else {
                tipos = await TipoDocumento.findAll({
                    where: {
                        "en_empresa": true,
                        "en_persona": false,
                        "estado": true
                    },
                    attributes: TIPO_DOCUMENTO_ATTRIBUTES,
                    order: [
                        ['nombre', 'ASC']
                    ]
                })
            }

            return { result: true, data: tipos, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getById(id: number): Promise<TipoDocumentoResponse> {
        try {
            const tipo = await TipoDocumento.findByPk(id, {
                attributes: TIPO_DOCUMENTO_ATTRIBUTES
            })

            if (!tipo) {
                return { result: false, message: 'Tipo de documento no encontrado', status: 400 }
            }

            return { result: true, data: tipo, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async create(data: ITipoDocumento): Promise<TipoDocumentoResponse> {
        try {
            data.nombre_url = HString.convertToUrlString(data.nombre as string)

            const newTipo = await TipoDocumento.create(data as ITipoDocumento)

            const { id } = newTipo

            if (id) {
                return { result: true, message: 'Tipo de documento registrado con éxito', data: newTipo, status: 200 }
            }

            return { result: false, message: 'Error al registrar el tipo de documento', data: [], status: 500 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async update(id: number, data: ITipoDocumento): Promise<TipoDocumentoResponse> {
        try {
            data.nombre_url = HString.convertToUrlString(data.nombre as string)

            const tipo = await TipoDocumento.findByPk(id)

            if (!tipo) {
                return { result: false, message: 'Tipo de documento no encontrado', data: [], status: 200 }
            }

            const dataTipoDocumento: Partial<ITipoDocumento> = data

            const updatedTipo = await tipo.update(dataTipoDocumento)

            return { result: true, message: 'Tipo de documento actualizado con éxito', data: updatedTipo, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async delete(id: number): Promise<TipoDocumentoResponse> {
        try {
            const tipo = await TipoDocumento.findByPk(id)

            if (!tipo) {
                return { result: false, message: 'Tipo de documento no encontrado', data: [], status: 200 };
            }

            await tipo.destroy();

            return { result: true, data: { id }, message: 'Tipo de documento eliminado correctamente', status: 200 };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 };
        }
    }
}

export default new TipoDocumentoRepository()