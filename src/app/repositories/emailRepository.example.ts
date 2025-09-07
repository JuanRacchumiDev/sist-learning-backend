import fs from 'fs'
import path from 'path'
import transporter from "../config/mailer"
import { Attachment } from "nodemailer/lib/mailer"
import { IAlumno } from "../interfaces/Alumno/IAlumno"
import { IAdjunto } from "../interfaces/Adjunto/IAdjunto"

class EmailRepository {
    async sendAlumnoInscripcionEmail(alumno: IAlumno) {
        const html = this.readTemplate('alumnoInscripcion.html')
            .replace('{{ nombre }}', alumno.nombres || '')
            .replace('{{ apellido }}', alumno.apellido_paterno || '')

        await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: alumno.email,
            subject: '¡Bienvenido a tu curso!',
            html
        })
    }

    async setAlumnoContenidoEmail(alumno: IAlumno, contenidos: IAdjunto[]) {
        const adjuntos: Attachment[] = []
        const enlaces: string[] = []

        contenidos.forEach(contenido => {
            if (contenido.es_descargable && contenido.filepath?.endsWith('.pdf')) {
                const filePath = path.resolve(__dirname, `../../public/contenidos/${contenido.filepath}`)
                const titleContenido = contenido.titulo as string
                const filename = `${titleContenido}${'.pdf'}`
                if (fs.existsSync(filePath)) {
                    adjuntos.push({
                        filename,
                        path: filePath
                    })
                }
            } else if (!contenido.es_descargable && contenido.filepath) {
                enlaces.push(`<li><a href="${contenido.filepath}" target="_blank">${contenido.titulo}</a></li>`)
            }
        })
    }

    private readTemplate(file: string): string {
        return fs.readFileSync(path.resolve(__dirname, `../templates/${file}`), 'utf8')
    }
}

export default new EmailRepository()