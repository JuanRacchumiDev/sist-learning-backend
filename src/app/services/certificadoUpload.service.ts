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

class CertificadoUploadService {
    async downloadPorFilename(filename: string) {
        return await CertificadoUploadRepository.downloadByName(filename)
    }

    async upload(data: ICertificadoUpload) {
        // console.log('data upload')
        // console.log({ data })
        // const codigoQR = HString.generateCodigo()

        // const qrX = 20

        // const qrY = 400

        const { file_path, id_alumno, id_evento } = data

        const originalFilePath = file_path as string;

        // console.log({ originalFilePath })

        // const newFilename = `${file_name}`; // Nuevo nombre de archivo

        // const newFilePath = path.join(path.dirname(originalFilePath), newFilename);

        // console.log({ newFilename })

        // console.log({ newFilePath })

        // const baseUrl = process.env.BASE_URL || 'http://localhost:3002';

        try {
            // Genera un ID único para el QR (puedes usar el id_alumno y id_evento o un UUID)
            // const qrCodeData = `${baseUrl}/validacion-certificado/${data.id_alumno}-${data.id_evento}`;

            // Obtener los datos del certificado anterior, si existe
            const certificadoExistingResponse = await CertificadoUploadRepository.getByAlumnoIdEventoId(
                id_alumno as number,
                id_evento as number
            )

            // console.log({ certificadoExistingResponse })

            const {
                result: resultCertificadoExisting,
                data: dataCertificadoExisting
            } = certificadoExistingResponse

            if (resultCertificadoExisting && dataCertificadoExisting) {
                // console.log('existe certificado subido')
                // console.log({ dataCertificadoExisting })

                const certificadoExisting = dataCertificadoExisting as ICertificadoUpload

                // console.log({ certificadoExisting })

                const { id, file_path, codigo_qr } = certificadoExisting

                if (file_path && await fs.pathExists(file_path)) {
                    await fs.remove(file_path);
                    // console.log(`PDF anterior eliminado: ${file_path}`);
                }

                if (codigo_qr && await fs.pathExists(codigo_qr)) {
                    await fs.remove(codigo_qr);
                    // console.log(`QR anterior eliminado: ${codigo_qr}`);
                }

                // console.log({ id })
                await CertificadoUploadRepository.delete(id as number);
            }

            // console.log('no existe certificado subido')
            // Obteniendo evento
            const responseEvento = await EventoRepository.getById(id_evento as number)
            const { data: dataEvento } = responseEvento
            const evento = dataEvento as IEvento
            const { titulo } = evento
            const sanitizedTitulo = HString.sanitizeFileName(titulo as string)

            // console.log({ sanitizedTitulo })

            // Obteniendo alumno
            const responseAlumno = await AlumnoRepository.getById(id_alumno as number)
            const { data: dataAlumno } = responseAlumno
            const alumno = dataAlumno as IAlumno
            const { nombre_capitalized } = alumno
            const sanitizedAlumno = HString.sanitizeFileName(nombre_capitalized as string)

            // console.log({ sanitizedAlumno })

            // Obteniendo certificado
            const responseCertificado = await CertificadoRepository.getByAlumnoIdEventoId(
                id_alumno as number,
                id_evento as number
            )
            const { data: dataCertificado } = responseCertificado
            // console.log(dataCertificado)
            const certificado = dataCertificado as ICertificado
            const { codigo } = certificado
            const codigoQR = codigo as string

            // console.log({ codigoQR })

            // console.log({ sanitizedTitulo })

            // console.log({ sanitizedAlumno })

            // Detemina el ambiente y la URL base
            const env: string = process.env.NODE_ENV || 'development'
            // Carga el archivo de configuración correspondiente
            const pathEnv: string = `.env.${env}`
            // console.log({ pathEnv })
            dotenv.config({ path: pathEnv })
            const baseUrl: string = process.env.CORS_ALLOWED_ORIGIN as string
            const qrCodeData: string = `${baseUrl}/web/certificado/${codigoQR}`

            // console.log({ baseUrl })
            // console.log({ qrCodeData })

            const qrCodeImage: string = await QRCode.toDataURL(qrCodeData);

            // Definimos la ruta de la carpeta de destino
            const uploadDirectory: string = path.resolve(__dirname, `../../../public/certificados/${sanitizedTitulo}/uploads`)
            // console.log({ uploadDirectory })

            // Crea el directorio si no existe de manera recursiva
            await fs.ensureDir(uploadDirectory)

            const codEvento: string = `${evento.id}`.toString().padStart(5, "0");

            const codAlumno: string = `${alumno.id}`.toString().padStart(5, "0");

            // Definiendo la nueva ruta del archivo final
            const newFilename: string = `certificado_e${codEvento}_a${codAlumno}_${codigoQR}.pdf`
            const newFilePath: string = path.join(uploadDirectory, newFilename);

            // console.log({ newFilename })
            // console.log({ newFilePath })

            // Carga el PDF subido
            const existingPdfBytes = await fs.readFile(originalFilePath);
            const pdfDoc = await PDFDocument.load(existingPdfBytes);

            const pages = pdfDoc.getPages();
            // console.log({ pages })

            // console.log({ pages })
            const secondPage = pages[1]; // Asume que el certificado está en la primera página
            // console.log({ secondPage })
            // console.log({ secondPage })

            // Incrusta la imagen del QR
            const qrImage = await pdfDoc.embedPng(qrCodeImage);

            // Define la posición y tamaño del QR. DEBES AJUSTAR ESTOS VALORES
            // para que coincidan con la plantilla de tu certificado.
            // const qrSize = 100;
            // const qrX = secondPage.getWidth() - qrSize - 50; // Ejemplo: en la esquina superior derecha
            // const qrY = 50;

            const qrDimensions = qrImage.scale(2.54)

            // console.log('secondPage.getWidth()')
            // console.log(secondPage.getWidth())

            // console.log('secondPage.getHeight()')
            // console.log(secondPage.getHeight())

            // console.log({ qrDimensions })

            const qrX = secondPage.getWidth() * 0.41
            const qrY = secondPage.getHeight() * 0.76

            const qrFilename: string = `qrcode_${sanitizedAlumno}.png`

            const qrOutputDirectory: string = path.resolve(__dirname, `../../../public/qrcodes/${sanitizedTitulo}/uploads`)

            // console.log({ qrFilename })

            // console.log({ qrOutputDirectory })

            // const qrOutputPath = path.resolve(__dirname, `../../../public/qrcodes/${sanitizedTitulo}/uploads/${qrFilename}`)

            // const qrOutputDirectory = path.dirname(qrOutputPath);

            await fs.ensureDir(qrOutputDirectory)

            const qrOutputPath: string = `${qrOutputDirectory}/${qrFilename}`

            // console.log({ qrOutputPath })

            await QRCode.toFile(qrOutputPath, qrCodeData);

            // console.log({ qrX })
            // console.log({ qrY })

            secondPage.drawImage(qrImage, {
                x: qrX,
                y: qrY,
                width: qrDimensions.width,
                height: qrDimensions.height
                // width: qrSize,
                // height: qrSize,
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

        // return await CertificadoUploadRepository.upload(data)
    }
}

export default new CertificadoUploadService();