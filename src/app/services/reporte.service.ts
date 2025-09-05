import { AlumnoResponse } from "../interfaces/Alumno/IAlumno";
import { Alumno } from "../models/alumno.models";
import AlumnoRepository from '../repositories/Alumno/AlumnoRepository'
import { PersonaResponse } from "../interfaces/Persona/IPersona";
import personaRepository from "../repositories/Persona/PersonaRepository";
import { REPORT_ALUMNO_ATTRIBUTES } from "../../constants/Reports/ReportAlumnoConstant";
import { TIPO_DOCUMENTO_INCLUDE } from "../../includes/TipoDocumentoInclude";
import { PAIS_INCLUDE } from "../../includes/PaisInclude";
import { DEPARTAMENTO_INCLUDE } from "../../includes/DepartamentoInclude";

class ReporteService {
    async getCumpleaniosAlumnos(): Promise<AlumnoResponse> {
        try {
            const alumnos = await Alumno.findAll({
                where: {
                    estado: 1
                },
                attributes: REPORT_ALUMNO_ATTRIBUTES,
                include: [
                    TIPO_DOCUMENTO_INCLUDE,
                    PAIS_INCLUDE,
                    DEPARTAMENTO_INCLUDE
                ],
                order: [
                    ['fecha_nacimiento', 'ASC']
                ]
            })

            return { result: true, data: alumnos }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage }
        }
    }

    async getAlumnos(): Promise<AlumnoResponse> {
        return await AlumnoRepository.getAll()
    }

    async getPersonas(): Promise<PersonaResponse> {
        return await personaRepository.getAll()
    }

}

export default new ReporteService()