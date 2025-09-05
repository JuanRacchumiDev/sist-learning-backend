import EmailRepository from "../repositories/emailRepository.example"
import { IAlumno } from "../interfaces/Alumno/IAlumno"

class EmailService {
    async sendAlumnoInscripcion(data: IAlumno) {
        return await EmailRepository.sendAlumnoInscripcionEmail(data)
    }
}

export default new EmailService()