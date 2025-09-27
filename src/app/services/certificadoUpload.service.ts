import { ICertificadoUpload } from "../interfaces/CertificadoUpload/ICertificadoUpload"
import CertificadoUploadRepository from "../repositories/CertificadoUpload/CertificadoUploadRepository"
import EventoRepository from "../repositories/Evento/EventoRepository"
import AlumnoRepository from "../repositories/Alumno/AlumnoRepository"
import CertificadoRepository from "../repositories/Certificado/CertificadoRepository"
import fs from 'fs-extra';
import QRCode from 'qrcode';
import dotenv from 'dotenv';
import { PDFDocument } from 'pdf-lib';
import path from 'path';
import HString from "../../helpers/HString";
import { IEvento } from "../interfaces/Evento/IEvento";
import { IAlumno } from "../interfaces/Alumno/IAlumno";
import { ICertificado } from "../interfaces/Certificado/ICertificado"
import { Request, Response } from 'express'

class CertificadoUploadService {
    async downloadPorFilename(filename: string) {
        return await CertificadoUploadRepository.downloadByName(filename)
    }

    async getCertificadoPorCodigo(codigo: string) {
        return await CertificadoUploadRepository.getByCodigo(codigo)
    }

    async upload(data: ICertificadoUpload) {
        const { file_path, id_alumno, id_evento, codigo: paramCodigo } = data

        const originalFilePath = file_path as string;

        let codigoQR: string = ""

        try {
            // Genera un ID único para el QR (puedes usar el id_alumno y id_evento o un UUID)

            // Obtener los datos del certificado anterior, si existe
            const certificadoExistingResponse = await CertificadoUploadRepository.getByAlumnoIdEventoId(
                id_alumno as number,
                id_evento as number
            )

            console.log({ certificadoExistingResponse })

            const {
                result: resultCertificadoExisting,
                data: dataCertificadoExisting
            } = certificadoExistingResponse

            if (resultCertificadoExisting && dataCertificadoExisting) {

                const certificadoExisting = dataCertificadoExisting as ICertificadoUpload

                console.log({ certificadoExisting })

                const { id, file_path, codigo_qr } = certificadoExisting

                if (file_path && await fs.pathExists(file_path)) {
                    console.log('archivo eliminado')
                    await fs.remove(file_path);
                }

                if (codigo_qr && await fs.pathExists(codigo_qr)) {
                    console.log('qr eliminado')
                    await fs.remove(codigo_qr);
                }

                await CertificadoUploadRepository.delete(id as number);
            }

            // Obteniendo evento
            const responseEvento = await EventoRepository.getById(id_evento as number)
            const { data: dataEvento } = responseEvento
            const evento = dataEvento as IEvento
            const { titulo } = evento
            const sanitizedTitulo = HString.sanitizeFileName(titulo as string)

            // Obteniendo alumno
            const responseAlumno = await AlumnoRepository.getById(id_alumno as number)
            const { data: dataAlumno } = responseAlumno
            const alumno = dataAlumno as IAlumno
            const { nombre_capitalized } = alumno
            const sanitizedAlumno = HString.sanitizeFileName(nombre_capitalized as string)

            // Obteniendo certificado
            const responseCertificado = await CertificadoRepository.getByAlumnoIdEventoId(
                id_alumno as number,
                id_evento as number
            )

            const { data: dataCertificado } = responseCertificado

            if (paramCodigo) {
                codigoQR = paramCodigo
            } else {
                if (dataCertificado) {
                    const certificado = dataCertificado as ICertificado
                    const { codigo } = certificado
                    codigoQR = codigo as string
                }
            }

            // Detemina el ambiente y la URL base
            const env: string = process.env.NODE_ENV || 'development'

            // Carga el archivo de configuración correspondiente
            const pathEnv: string = `.env.${env}`

            dotenv.config({ path: pathEnv })

            const baseUrl: string = process.env.CORS_ALLOWED_ORIGIN as string

            const qrCodeData: string = `${baseUrl}/web/certificado/${codigoQR}`

            const qrCodeImage: string = await QRCode.toDataURL(qrCodeData);

            // Definimos la ruta de la carpeta de destino
            const uploadDirectory: string = path.resolve(__dirname, `../../../public/certificados/${sanitizedTitulo}/uploads`)

            // Crea el directorio si no existe de manera recursiva
            await fs.ensureDir(uploadDirectory)

            const codEvento: string = `${evento.id}`.toString().padStart(5, "0");

            const codAlumno: string = `${alumno.id}`.toString().padStart(5, "0");

            // Definiendo la nueva ruta del archivo final
            const newFilename: string = `certificado_e${codEvento}_a${codAlumno}_${codigoQR}.pdf`
            const newFilePath: string = path.join(uploadDirectory, newFilename);

            // Carga el PDF subido
            const existingPdfBytes = await fs.readFile(originalFilePath);
            const pdfDoc = await PDFDocument.load(existingPdfBytes);

            const pages = pdfDoc.getPages();

            const secondPage = pages[1]; // Asume que el certificado está en la primera página

            // Incrusta la imagen del QR
            const qrImage = await pdfDoc.embedPng(qrCodeImage);

            // Define la posición y tamaño del QR. DEBES AJUSTAR ESTOS VALORES
            // para que coincidan con la plantilla de tu certificado.
            const qrDimensions = qrImage.scale(2.56)

            const qrX = secondPage.getWidth() * 0.408

            const qrY = secondPage.getHeight() * 0.77

            const qrFilename: string = `qrcode_${sanitizedAlumno}.png`

            const qrOutputDirectory: string = path.resolve(__dirname, `../../../public/qrcodes/${sanitizedTitulo}/uploads`)

            await fs.ensureDir(qrOutputDirectory)

            const qrOutputPath: string = `${qrOutputDirectory}/${qrFilename}`

            await QRCode.toFile(qrOutputPath, qrCodeData);

            secondPage.drawImage(qrImage, {
                x: qrX,
                y: qrY,
                width: qrDimensions.width,
                height: qrDimensions.height
            });

            // Guarda el PDF modificado
            const modifiedPdfBytes = await pdfDoc.save();
            await fs.writeFile(newFilePath, modifiedPdfBytes);

            // Actualiza los datos con la nueva ruta y nombre de archivo antes de guardarlos en el repositorio
            data.file_path = newFilePath;
            data.file_name = newFilename;
            data.codigo = codigoQR
            data.codigo_qr = qrOutputPath

            // Elimina el archivo original subido por Multer para limpiar
            await fs.remove(originalFilePath);

            return await CertificadoUploadRepository.upload(data);
        } catch (error) {
            console.error('Error al procesar el PDF y el QR:', error);

            // Si algo falla, es crucial limpiar el archivo subido para evitar basura en el servidor
            await fs.remove(originalFilePath).catch(err => console.error('Error al limpiar archivo:', err));

            return {
                result: false,
                message: 'Error al procesar el certificado subido',
                status: 500,
                error
            };
        }
    }

    async getCertificadoPorAlumnoPorEvento(id_alumno: number, id_evento: number) {
        return await CertificadoUploadRepository.getByAlumnoIdEventoId(id_alumno, id_evento)
    }
}

export default new CertificadoUploadService();