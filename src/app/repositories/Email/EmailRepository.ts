import transporter from '../../config/mailer'
import { IEmail } from "../../interfaces/Email/IEmail"

class EmailRepository {
    async sendEmail({ to, subject, text, copyTo }: IEmail): Promise<any> {
        const recipients = copyTo ? [to, copyTo].join(',') : to

        const mailOptions = {
            from: process.env.EMAIL_USER_GMAIL,
            to: recipients,
            subject,
            text
        }

        try {
            const info = await transporter.sendMail(mailOptions)
            return info
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            console.log('errorMessage', errorMessage)
        }
    }
}

export default new EmailRepository()