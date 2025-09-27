import { IPersona, PersonaResponse } from "../../interfaces/Persona/IPersona";
import { ITipoDocumento } from "../../interfaces/TipoDocumento/ITipoDocumento";
import PersonaService from "../../services/persona.service"
import TipoDocumentoService from "../../services/tipoDocumento.service"
import { API_DNI, API_CEE } from "../../../helpers/HApi"
import dotenv from 'dotenv';
import axios from "axios";
import HString from "../../../helpers/HString";
import { EOrigen } from "../../../enums/EOrigen";

class DocumentoRepository {
    async getInfo(idTipoDocumento: number, numeroDocumento: string): Promise<PersonaResponse> {
        try {
            let urlApiDoc = ""

            // Verificando si existe una persona
            const responsePersona = await PersonaService.getPersonaPorIdTipoDocAndNumDoc(idTipoDocumento, numeroDocumento)

            const getTipoDocumento = await TipoDocumentoService.getTipoPorId(idTipoDocumento);

            const dataTipoDocumento = getTipoDocumento.data as ITipoDocumento

            const { abreviatura } = dataTipoDocumento

            const { result: resultPersona, data: dataPersona, status: statusPersona } = responsePersona

            if (!resultPersona) {

                urlApiDoc = (abreviatura === 'DNI')
                    ? `${API_DNI}${numeroDocumento}`
                    : `${API_CEE}${numeroDocumento}`

                // Determina el ambiente
                const env = process.env.NODE_ENV || 'development'

                dotenv.config({ path: `.env.${env}` })

                const token = process.env.TOKEN_API_DOCS

                const response = await axios.get(`${urlApiDoc}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                const { data: dataApiPersona } = response

                const { success, data: dataDetailPersona, message, status } = dataApiPersona

                if (success) {
                    const {
                        numero,
                        nombres,
                        apellido_paterno,
                        apellido_materno,
                        nombre_completo,
                        departamento,
                        provincia,
                        distrito,
                        direccion,
                        direccion_completa,
                        ubigeo_reniec,
                        ubigeo_sunat,
                        ubigeo,
                        fecha_nacimiento,
                        estado_civil,
                        foto,
                        sexo
                    } = dataDetailPersona

                    const persona: IPersona = {
                        id_tipodocumento: idTipoDocumento,
                        numero: HString.validateField(numero),
                        nombres: HString.validateField(nombres),
                        apellido_paterno: HString.validateField(apellido_paterno),
                        apellido_materno: HString.validateField(apellido_materno),
                        nombre_completo: HString.validateField(nombre_completo),
                        departamento: HString.validateField(departamento),
                        provincia: HString.validateField(provincia),
                        distrito: HString.validateField(distrito),
                        direccion: HString.validateField(direccion),
                        direccion_completa: HString.validateField(direccion_completa),
                        ubigeo_reniec: HString.validateField(ubigeo_reniec),
                        ubigeo_sunat: HString.validateField(ubigeo_sunat),
                        ubigeo: HString.validateUbigeo(ubigeo),
                        fecha_nacimiento: HString.validateField(fecha_nacimiento),
                        estado_civil: HString.validateField(estado_civil),
                        foto: HString.validateField(foto),
                        sexo: HString.validateField(sexo),
                        origen: EOrigen.API,
                        estado: true
                    }

                    const responseCreatePersona = await PersonaService.createPersona(persona)

                    const { result, data, message, status, error } = responseCreatePersona

                    if (result) {
                        return { result, data, message, status }
                    } else {
                        return { result, error, status }
                    }
                } else {
                    return { result: success, message, data: dataDetailPersona, status }
                }
            } else {
                return { result: resultPersona, data: dataPersona, status: statusPersona }
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'

            if (errorMessage === 'Request failed with status code 404') {
                const message = `No se encontró información con el número de documento: ${numeroDocumento}`
                return { result: false, message, status: 404 }
            } else {
                return { result: false, error: errorMessage, status: 500 }
            }
        }
    }
}

export default new DocumentoRepository()