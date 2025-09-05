import EmailRepository from "../repositories/Email/EmailRepository"
import { IEmail } from "../interfaces/Email/IEmail"

class EmailService {
    async sendEmail({ to, subject, text, copyTo }: IEmail) {
        return await EmailRepository.sendEmail({ to, subject, text, copyTo })
    }
}

export default new EmailService()