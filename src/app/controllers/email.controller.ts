import { Request, Response } from 'express'
import EmailService from '../services/email.service'

class EmailController {
    async sendEmail(req: Request, res: Response) {
        const { to, subject, text, copyTo } = req.body

        try {
            const responseEmail = await EmailService.sendEmail({ to, subject, text, copyTo })

            // Validar si responseEmail existe y tiene messageId
            if (responseEmail && typeof responseEmail.messageId === 'string') {
                res.status(200).json(
                    {
                        success: true,
                        messageId: responseEmail.messageId
                    }
                )
            } else {
                res.status(500).json({
                    success: false,
                    error: 'Error al obtener el ID del mensaje de correo.',
                });
            }
        } catch (error: unknown) {
            console.error('Error al enviar el correo:', error);

            if (error instanceof Error) {
                res.status(500).json({ success: false, error: error.message });
            } else {
                res.status(500).json({ success: false, error: 'Unknown error' });
            }
        }
    }
}

export default new EmailController()