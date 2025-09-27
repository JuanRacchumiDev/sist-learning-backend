import { IAlumno } from "../app/interfaces/Alumno/IAlumno";
import { ICertificado } from "../app/interfaces/Certificado/ICertificado";
import { IEvento } from "../app/interfaces/Evento/IEvento";
import path from "path";
import fs from 'fs';
import HDate from "./HDate";
import { toZonedTime } from "date-fns-tz";
import { format } from "date-fns";
import HString from "./HString";
import { es } from 'date-fns/locale';
import { PDFDocument, PDFImage, rgb } from "pdf-lib";
import fontkit from 'fontkit';
import QRCode from 'qrcode';
import dotenv from 'dotenv';
import { TResponseCertificado } from '../app/types/TCertificado';
import PlantillaRepository from "../app/repositories/Plantilla/PlantillaRepository";
import { IPlantilla } from "../app/interfaces/Plantilla/IPlantilla";
import { TIMEZONES } from "../constants/TimeZoneConstant";
import { ITipoEvento } from "../app/interfaces/TipoEvento/ITipoEvento";

export default class HPdf {
    static async generarCertificado(data: ICertificado, alumno: IAlumno, evento: IEvento): Promise<TResponseCertificado> {
        try {
            let getCodigo: string = ""

            let fechasEvento: string[] = []

            // Variables para los textos en el documento
            let fontSizeForAlumno = 0

            let y = 0

            let x = 0

            let maxWidth = 0

            let fontSizeForEvento = 0

            let fontSizeForFechaEvento = 0

            let fontSizeForFechaEmision = 0

            let linesAlumno = []

            let lineWidthAlumno = 0

            let lineHeightAlumno = 0

            let linesEvento = []

            let lineWidthEvento = 0

            let lineHeightEvento = 0

            let lineWidthFechaEvento = 0

            let fechaEventoPositionX = 0

            const { id_plantilla, nombre_impresion, id: idCertificado, codigo } = data

            const idPlantilla = id_plantilla as number

            const responsePlantilla = await PlantillaRepository.getById(idPlantilla)

            const { result: resultPlantilla, data: dataPlantilla, message: messagePlantilla } = responsePlantilla

            if (!resultPlantilla && !dataPlantilla) {
                return { result: !resultPlantilla, message: messagePlantilla }
            }

            const { path: pathPlantilla } = dataPlantilla as IPlantilla

            const pathAbsoluteTemplate = path.resolve(__dirname, `../../public/pdf/${pathPlantilla}`)

            const pathFontKuenstler = path.resolve(__dirname, '../../public/fonts/KUNSTLER.TTF')

            const pathFontKuenstlerBold = path.resolve(__dirname, "../../public/fonts/Kuenstler Script LT Std 2 Bold.otf");

            const pathFontBalooBold = path.resolve(__dirname, '../../public/fonts/BalooChettan2-Bold.ttf')

            const pathFontBalooMedium = path.resolve(__dirname, '../../public/fonts/BalooChettan2-Medium.ttf')

            const pathLogo = path.resolve(__dirname, '../../public/img/logo_transparente_small.png')

            if (!fs.existsSync(pathAbsoluteTemplate)) {
                return { result: false, message: `No existe la plantilla ${pathAbsoluteTemplate}` }
            }

            if (!fs.existsSync(pathFontKuenstler)) {
                return { result: false, message: `No existe fuente KUNSTLER.TTF` }
            }

            if (!fs.existsSync(pathFontKuenstlerBold)) {
                return { result: false, message: `Kuenstler Script LT Std 2 Bold.otf` }
            }

            if (!fs.existsSync(pathFontBalooBold)) {
                return { result: false, message: `No existe fuente BalooChettan2-Bold.ttf` }
            }

            if (!fs.existsSync(pathFontBalooMedium)) {
                return { result: false, message: `No existe fuente BalooChettan2-Medium.ttf` }
            }

            if (!fs.existsSync(pathLogo)) {
                return { result: false, message: `No existe el logo` }
            }

            // Definiendo título del archivo
            const { titulo, temario, fecha_inicio, fecha_fin, tipoEvento } = evento

            const { nombre_url } = tipoEvento as ITipoEvento

            const nombreTipoEvento: string = nombre_url as string

            const { nombre_capitalized } = alumno

            const nombreImpresion = nombre_impresion as string;

            const tituloEvento = titulo as string

            const temarioEvento = temario?.split('\n') as String[]

            const setFecha: string | undefined = (!fecha_inicio) ? fecha_fin : fecha_inicio

            const fechaInicioStr = format(setFecha as string, "dd 'de' MMMM 'del' yyyy", { locale: es })

            const sanitizedTitulo = HString.sanitizeFileName(titulo as string)

            const sanitizedAlumno = HString.sanitizeFileName(nombre_capitalized as string)

            const codEvento = `${evento.id}`.toString().padStart(5, "0");

            const codAlumno = `${alumno.id}`.toString().padStart(5, "0");

            if (!idCertificado && !codigo) {
                getCodigo = HString.generateCodigo()
            } else {
                getCodigo = codigo as string
            }

            const filename = `certificado_e${codEvento}_a${codAlumno}_${getCodigo}.pdf`

            const outputPath = path.resolve(__dirname, `../../public/certificados/${sanitizedTitulo}/${filename}`)

            if (fecha_fin) {
                const fechaFinal = toZonedTime(fecha_fin, TIMEZONES.LIMA)

                const fechaFinalStr = format(fechaFinal, "dd 'de' MMMM 'del' yyyy", { locale: es })

                fechasEvento.push(`${fechaInicioStr} al`)

                fechasEvento.push(fechaFinalStr)
            } else {
                fechasEvento.push(`${fechaInicioStr}`)
            }

            // Verificando que el directorio de salida exista, sino se crea
            const outputDir = path.dirname(outputPath)

            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true })
            }

            // Cargar el PDF de plantilla
            const templateBytes = fs.readFileSync(pathAbsoluteTemplate);

            const pdfDoc = await PDFDocument.load(templateBytes);

            // Registrar fontkit
            pdfDoc.registerFontkit(fontkit as any)

            // Cargar la fuente
            const fontKuenstlerBold = fs.readFileSync(pathFontKuenstlerBold)
            const customFontKuenstlerBold = await pdfDoc.embedFont(fontKuenstlerBold)

            const fontKuenstler = fs.readFileSync(pathFontKuenstler)
            const customFontKuenstler = await pdfDoc.embedFont(fontKuenstler)

            // Cargar otra fuentes
            const fontBalooBold = fs.readFileSync(pathFontBalooBold)
            const customFontBalooBold = await pdfDoc.embedFont(fontBalooBold)

            const fontBalooMedium = fs.readFileSync(pathFontBalooMedium)
            const customFontBalooMedium = await pdfDoc.embedFont(fontBalooMedium)

            // Obtener la primera página
            const pagina = pdfDoc.getPage(0)

            // Obtener el ancho de la página
            const pageWidth = pagina.getWidth()

            switch (pathPlantilla) {
                case "plantillas/plantilla_d.pdf":

                    // Configurar el texto del nombre del alumno
                    fontSizeForAlumno = 48;

                    y = 345;  // Posición Y
                    maxWidth = 720; // Ancho máximo disponible para el texto

                    // Distancia entre líneas para el nombre del alumno
                    lineHeightAlumno = 0.8 * fontSizeForAlumno;

                    // Dividir el nombre del alumno en líneas si excede el ancho máximo
                    linesAlumno = this.splitTextIntoLines(nombreImpresion, maxWidth, customFontKuenstlerBold, fontSizeForAlumno);

                    if (linesAlumno.length > 1) {
                        fontSizeForAlumno = 44;
                    }

                    // Dibujar el nombre del alumno centrado
                    for (let i = 0; i < linesAlumno.length; i++) {
                        lineWidthAlumno = customFontKuenstlerBold.widthOfTextAtSize(linesAlumno[i], fontSizeForAlumno);
                        const nombrePositionX = (pageWidth - lineWidthAlumno) / 2;  // Centrado horizontal

                        pagina.drawText(linesAlumno[i], {
                            x: nombrePositionX,
                            y: y - i * lineHeightAlumno,
                            size: fontSizeForAlumno,
                            font: customFontKuenstlerBold,
                            color: rgb(0, 0, 0),
                        });
                    }

                    // Configurar el texto del título del evento
                    fontSizeForEvento = 30;

                    maxWidth = 480

                    y -= 90; // Ajustar la posición Y para el siguiente texto

                    // Distancia entre líneas para el nombre del evento
                    lineHeightEvento = 0.8 * fontSizeForEvento;

                    // Dividir el título del evento si es necesario
                    linesEvento = this.splitTextIntoLines(tituloEvento, maxWidth, customFontBalooBold, fontSizeForEvento);

                    for (let i = 0; i < linesEvento.length; i++) {
                        lineWidthEvento = customFontBalooBold.widthOfTextAtSize(linesEvento[i], fontSizeForEvento);

                        const tituloEventoPositionX = (pageWidth - lineWidthEvento) / 2;  // Centrado horizontal

                        // Dibujar el título del evento centrado
                        pagina.drawText(linesEvento[i], {
                            x: tituloEventoPositionX,
                            y: y - i * lineHeightEvento,
                            size: fontSizeForEvento,
                            font: customFontBalooBold,
                            color: rgb(0 / 255, 32 / 255, 58 / 255),
                        });
                    }

                    // Configurar el texto de la fecha del evento
                    fontSizeForFechaEvento = 24;

                    y -= 60

                    for (let i = 0; i < fechasEvento.length; i++) {
                        lineWidthFechaEvento = customFontBalooMedium.widthOfTextAtSize(fechasEvento[i], fontSizeForFechaEvento);

                        fechaEventoPositionX = (pageWidth - lineWidthFechaEvento) / 2;

                        pagina.drawText(fechasEvento[i], {
                            x: fechaEventoPositionX,
                            y: y - i * lineHeightEvento, // Ajustar la posición vertical para cada línea
                            size: fontSizeForFechaEvento,
                            font: customFontBalooMedium,
                            color: rgb(222 / 255, 148 / 255, 40 / 255),
                        });
                    }
                    break;
                case "plantillas/plantilla_primer_congreso_internacional_2025.pdf":
                case "plantillas/plantilla_primer_congreso_internacional_2025_sin_firma.pdf":
                    // Configurar el texto del nombre del alumno
                    fontSizeForAlumno = 56;

                    y = 280;  // Posición Y
                    maxWidth = 540; // Ancho máximo disponible para el texto

                    // Distancia entre líneas para el nombre del alumno
                    lineHeightAlumno = 0.8 * fontSizeForAlumno;

                    // Dividir el nombre del alumno en líneas si excede el ancho máximo
                    linesAlumno = this.splitTextIntoLines(nombreImpresion, maxWidth, customFontKuenstlerBold, fontSizeForAlumno);

                    if (linesAlumno.length > 1) {
                        fontSizeForAlumno = 52;
                        y += 20;
                    }

                    // Dibujar el nombre del alumno centrado
                    for (let i = 0; i < linesAlumno.length; i++) {
                        lineWidthAlumno = customFontKuenstlerBold.widthOfTextAtSize(linesAlumno[i], fontSizeForAlumno);
                        const nombrePositionX = (pageWidth - lineWidthAlumno) / 2;  // Centrado horizontal

                        pagina.drawText(linesAlumno[i], {
                            x: nombrePositionX,
                            y: y - i * lineHeightAlumno,
                            size: fontSizeForAlumno,
                            font: customFontKuenstlerBold,
                            color: rgb(0, 0, 0),
                        });
                    }
                    break
                case "plantillas/diploma_especializacion.pdf":
                    // Configurar el texto del nombre del alumno

                    y = 330;  // Posición Y

                    fontSizeForAlumno = 46

                    maxWidth = 520; // Ancho máximo disponible para el texto

                    lineHeightAlumno = 0.8 * fontSizeForAlumno;

                    // Dividir el nombre del alumno en líneas si excede el ancho máximo
                    linesAlumno = this.splitTextIntoLines(nombreImpresion, maxWidth, customFontKuenstlerBold, fontSizeForAlumno);

                    if (linesAlumno.length === 1) {
                        fontSizeForAlumno = 50
                    } else {
                        y = 340
                    }

                    // Dibujar el nombre del alumno centrado
                    for (let i = 0; i < linesAlumno.length; i++) {
                        lineWidthAlumno = customFontKuenstlerBold.widthOfTextAtSize(linesAlumno[i], fontSizeForAlumno);

                        const nombrePositionX = ((pageWidth - lineWidthAlumno) / 2) + 110;  // Centrado horizontal

                        pagina.drawText(linesAlumno[i], {
                            x: nombrePositionX,
                            y: y - i * lineHeightAlumno,
                            size: fontSizeForAlumno,
                            font: customFontKuenstlerBold,
                            color: rgb(0, 0, 0),
                        });
                    }

                    // Configurar el texto del título del evento
                    fontSizeForEvento = 26;

                    const tituloEventoPositionX = ((pageWidth - lineWidthEvento) / 2) - 60

                    if (linesAlumno.length === 1) {
                        y -= 70
                    } else {
                        y -= 78
                    }

                    pagina.drawText(tituloEvento, {
                        x: tituloEventoPositionX,
                        y,
                        size: fontSizeForEvento,
                        font: customFontBalooBold,
                        color: rgb(0 / 255, 32 / 255, 58 / 255),
                    });
                    break
            }

            // Crear nueva página para el logo, código QR y tabla
            const newPageWidth = 842

            const newPageHeight = 590

            const newPage = pdfDoc.addPage([newPageWidth, newPageHeight]);

            // Crear un rectángulo para texto introductorio
            const startX = 20

            const startY = newPage.getHeight() - 170

            const cellWidth = (nombreTipoEvento !== 'diploma-de-especializacion') ? 390 : 270

            const cellHeight = (nombreTipoEvento !== 'diploma-de-especializacion') ? 50 : 155

            newPage.drawRectangle({
                x: startX,
                y: startY,
                width: cellWidth,
                height: cellHeight,
                color: rgb(1, 1, 1),
            });

            // Añadir texto a la celda
            let texto: string = ""

            if (nombreTipoEvento !== 'diploma-de-especializacion') {
                texto = `Esta es una copia auténtica imprimible de un documento electrónico archivado por PerúAgro, `
                texto += `aplicando lo dispuesto por el Art. 25 de D.S. 070-2013-PCM y `
                texto += `la Tercera Disposición Complementaria Final del D.S. 026-2016-PCM.`
            } else {
                texto = `Esta es una copia auténtica imprimible de un documento `
                texto += `electrónico archivado por PerúAgro, aplicando lo dispuesto `
                texto += `por el Art. 25 de D.S. 070-2013-PCM y la Tercera Disposición `
                texto += `Complementaria Final del D.S. 026-2016-PCM.`
            }

            newPage.drawText(texto, {
                x: startX + 5,
                y: startY + 135,
                size: 12,
                lineHeight: 20,
                maxWidth: (cellWidth - 20),
                color: rgb(0, 0, 0),
            });

            // Cargar y añadir el logo
            const logoBytes = fs.readFileSync(pathLogo)
            const logoImage = await pdfDoc.embedPng(logoBytes)
            const logoDimensions = logoImage.scale(0.8)

            newPage.drawImage(logoImage, {
                x: newPage.getWidth() - logoDimensions.width - 20,
                y: newPage.getHeight() - logoDimensions.height,
                width: logoDimensions.width,
                height: logoDimensions.height
            })

            const startTemarioX = (nombreTipoEvento !== 'diploma-de-especializacion') ? 20 : 300
            let startTemarioY = (nombreTipoEvento !== 'diploma-de-especializacion') ? 440 : (startY + 135)
            const cellWidthTemario = (nombreTipoEvento !== 'diploma-de-especializacion') ? 350 : 300
            const cellHeightTemario = 20

            // Dibujar celda para el título del evento
            newPage.drawRectangle({
                x: startTemarioX,
                y: startTemarioY,
                width: cellWidthTemario + 50,
                height: cellHeightTemario,
                color: rgb(1, 1, 1),
            });

            // Dibujar el título del evento en la celda
            newPage.drawText(tituloEvento, {
                x: startTemarioX + 5,
                y: startTemarioY + 5,
                size: 14,
                font: customFontBalooBold,
                color: rgb(0 / 255, 32 / 255, 58 / 255)
            });

            startTemarioY = startTemarioY - 30

            // Dibujar celda para el título del temario
            newPage.drawRectangle({
                x: startTemarioX,
                y: startTemarioY,
                width: cellWidthTemario,
                height: cellHeightTemario,
                borderColor: rgb(0, 0, 0),
                borderWidth: 1,
                color: rgb(1, 1, 1),
            });

            newPage.drawText('Temario', {
                x: startTemarioX + 5,
                y: startTemarioY + 5,
                size: 12,
                color: rgb(0, 0, 0),
            });

            // Ajustar la posición para los ítems del temario
            let currentY = 0

            if (temarioEvento.length > 0) {

                temarioEvento.forEach((item, index) => {

                    if (index == 0) {
                        currentY = startTemarioY - index * (cellHeightTemario + 3)
                    }

                    // Dividir cada ítem del temario
                    const linesItemTemario = this.splitTextIntoLines(item as string, 210, customFontKuenstler, 12);

                    if (linesItemTemario.length > 0) {
                        for (let i = 0; i < linesItemTemario.length; i++) {
                            currentY -= 18

                            newPage.drawText(`${linesItemTemario[i]}`, {
                                x: startTemarioX + 3,
                                y: currentY,
                                size: 12,
                                lineHeight: 20,
                                color: rgb(0, 0, 0)
                            })
                        }
                    }

                    currentY -= 8
                })
            }

            // Crear un rectángulo para la sección del código QR
            let startQRX = (nombreTipoEvento !== 'diploma-de-especializacion') ? 570 : startX
            let startQRY = (nombreTipoEvento !== 'diploma-de-especializacion') ? 390 : 400
            let cellWidthQR = 240
            let cellHeightQR = 20

            newPage.drawRectangle({
                x: startQRX,
                y: startQRY,
                width: cellWidthQR,
                height: cellHeightQR,
                borderColor: rgb(0, 0, 0),
                borderWidth: 1,
                color: rgb(1, 1, 1),
            });

            // Dibujar el título en la celda
            newPage.drawText('REGISTRO ELECTRÓNICO', {
                x: startQRX + 5,
                y: startQRY + 5,
                size: 12,
                color: rgb(0, 0, 0),
            });

            // Dibujar nuevo rectángulo para el título de código de validación
            newPage.drawRectangle({
                x: startQRX,
                y: startQRY - 23,
                width: (cellWidthQR / 2),
                height: cellHeightQR,
                borderColor: rgb(0, 0, 0),
                borderWidth: 1,
                color: rgb(1, 1, 1),
            });

            // Dibujar el título en la celda
            newPage.drawText('Código Validación', {
                x: startQRX + 5,
                y: startQRY - 20,
                size: 12,
                color: rgb(0, 0, 0),
            });

            // Dibujar nuevo rectángulo para el código de validación
            newPage.drawRectangle({
                x: startQRX + (cellWidthQR / 2),
                y: startQRY - 23,
                width: (cellWidthQR / 2),
                height: cellHeightQR,
                borderColor: rgb(0, 0, 0),
                borderWidth: 1,
                color: rgb(1, 1, 1),
            });

            newPage.drawText(getCodigo, {
                x: startQRX + (cellWidthQR / 2) + 5,
                y: startQRY - 20,
                size: 12,
                color: rgb(0, 0, 0),
            });

            // Dibujar nuevo rectángulo para el título de verificación
            newPage.drawRectangle({
                x: startQRX,
                y: startQRY - 46,
                width: cellWidthQR,
                height: cellHeightQR,
                borderColor: rgb(0, 0, 0),
                borderWidth: 1,
                color: rgb(1, 1, 1),
            });

            newPage.drawText('VERIFICACIÓN EN LÍNEA', {
                x: startQRX + 5,
                y: startQRY - 43,
                size: 12,
                color: rgb(0, 0, 0),
            });

            // Dibujar nuevo rectángulo para el código QR
            newPage.drawRectangle({
                x: startQRX,
                y: startQRY - 170,
                width: cellWidthQR,
                height: (cellHeightQR * 6),
                borderColor: rgb(0, 0, 0),
                borderWidth: 1,
                color: rgb(1, 1, 1),
            });

            // Determina el ambiente
            const env = process.env.NODE_ENV || 'development'

            // Carga el archivo de configuración correspondiente
            const pathEnv = `.env.${env}`

            dotenv.config({ path: pathEnv })

            const baseUrl = process.env.CORS_ALLOWED_ORIGIN

            const dataUrlQR = `${baseUrl}/web/certificado/${getCodigo}`

            let qrCodeImage: PDFImage

            // const qrCodeFilePath = data.codigo_qr as string
            let qrCodeFilePath: string = ""

            // Validando si existe el QR
            try {
                if (data.id) {
                    qrCodeFilePath = data.codigo_qr as string

                    // Usamos fs.promises.access para evitar bloqueos sincrónicos
                    await fs.promises.access(qrCodeFilePath, fs.constants.F_OK)

                    // Si existe, obtenemos la imagen del QR desde la ruta local
                    const arrayBuffer = await fs.promises.readFile(qrCodeFilePath);
                    qrCodeImage = await pdfDoc.embedPng(arrayBuffer);
                } else {
                    const qrCodeDataUrl = await QRCode.toDataURL(`${dataUrlQR}`)
                    qrCodeImage = await pdfDoc.embedPng(qrCodeDataUrl)
                }
            } catch (err) {
                // Generar código QR
                const qrCodeDataUrl = await QRCode.toDataURL(`${dataUrlQR}`)
                qrCodeImage = await pdfDoc.embedPng(qrCodeDataUrl)
            }

            const qrCodeDimensions = qrCodeImage.scale(0.7)

            // Dibujando el código QR en la página
            newPage.drawImage(qrCodeImage, {
                x: startQRX + 60,
                y: startQRY - 168,
                width: qrCodeDimensions.width,
                height: qrCodeDimensions.height
            })

            // Dibujando el detalle de horas académicas, notas
            if (nombreTipoEvento === 'diploma-de-especializacion') {
                let startNotaY: number = startQRY - 250
                const widthNota: number = cellWidthQR
                const heightNota: number = cellHeightQR
                const textDuracion: string = `Duración: 12 módulos - 100% virtual`
                const textCertificacion: string = `720 horas académicas`
                const textModalidad: string = `Modalidad: Virtual`
                const textCIP: string = `Avalado por: Colegio de Ingenieros del Perú - CIP`
                const textNotaPromedio: string = `Promedio obtenido: 18.5`

                newPage.drawRectangle({
                    x: startQRX,
                    y: startNotaY,
                    width: widthNota,
                    height: heightNota,
                    color: rgb(1, 1, 1),
                });

                startNotaY += 5

                newPage.drawText(textDuracion, {
                    x: startQRX + 5,
                    y: startNotaY,
                    size: 12,
                    color: rgb(0, 0, 0),
                });

                startNotaY -= 20

                newPage.drawRectangle({
                    x: startQRX,
                    y: startNotaY,
                    width: widthNota,
                    height: heightNota,
                    color: rgb(1, 1, 1),
                });

                startNotaY += 5

                // Dibujar el título en la celda
                newPage.drawText(textCertificacion, {
                    x: startQRX + 5,
                    y: startNotaY,
                    size: 12,
                    color: rgb(0, 0, 0),
                });

                startNotaY -= 20

                newPage.drawRectangle({
                    x: startQRX,
                    y: startNotaY,
                    width: widthNota,
                    height: heightNota,
                    color: rgb(1, 1, 1),
                });

                startNotaY += 5

                // Dibujar el título en la celda
                newPage.drawText(textModalidad, {
                    x: startQRX + 5,
                    y: startNotaY,
                    size: 12,
                    color: rgb(0, 0, 0),
                });

                startNotaY -= 20

                newPage.drawRectangle({
                    x: startQRX,
                    y: startNotaY,
                    width: widthNota,
                    height: heightNota,
                    color: rgb(1, 1, 1),
                });

                startNotaY += 5

                // Dibujar el título en la celda
                newPage.drawText(textCIP, {
                    x: startQRX + 5,
                    y: startNotaY,
                    size: 12,
                    color: rgb(0, 0, 0),
                });

                startNotaY -= 20

                newPage.drawRectangle({
                    x: startQRX,
                    y: startNotaY,
                    width: widthNota,
                    height: heightNota,
                    color: rgb(1, 1, 1),
                });

                startNotaY += 5

                // Dibujar el título en la celda
                newPage.drawText(textNotaPromedio, {
                    x: startQRX + 5,
                    y: startNotaY,
                    size: 12,
                    color: rgb(0, 0, 0),
                });
            }

            // Guardar el PDF modificado
            const pdfBytes = await pdfDoc.save();
            fs.writeFileSync(outputPath, pdfBytes);

            // Guardar la ruta del QR como imagen
            const qrFilename = `qrcode_${sanitizedAlumno}.png`
            const qrOutputPath = path.resolve(__dirname, `../../public/qrcodes/${sanitizedTitulo}/${qrFilename}`)

            // Verificando que el directorio de salida exista, sino se crea
            const outputDirQRCode = path.dirname(qrOutputPath)

            // Verificamos si el directorio de salida existe
            try {
                await fs.promises.access(outputDirQRCode, fs.constants.F_OK)
            } catch (err) {

                // Si el directorio no existe, se crea
                await fs.promises.mkdir(outputDirQRCode, { recursive: true })
            }

            // Verificamos si el archivo QR existe
            try {
                await fs.promises.access(qrOutputPath, fs.constants.F_OK)
            } catch (err) {
                // Si el archivo no existe, lo generamos
                await QRCode.toFile(qrOutputPath, dataUrlQR);
            }

            const dataResult = {
                outputPath,
                filename,
                codigo_qr: qrOutputPath,
                codigo: getCodigo
            }

            return { result: true, message: 'Certificado generado con éxito', dataResult }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage };
        }
    }

    static splitTextIntoLines(text: string, maxWidth: number, font: any, fontSize: number) {
        const words = text.split(' '); // Dividir el texto por palabras
        let lines: string[] = [];
        let currentLine = '';

        for (let i = 0; i < words.length; i++) {
            const testLine = currentLine ? `${currentLine} ${words[i]}` : words[i];
            const width = font.widthOfTextAtSize(testLine, fontSize); // Medir el ancho del texto

            if (width <= maxWidth) {
                currentLine = testLine; // La palabra cabe en la línea actual
            } else {
                if (currentLine) {
                    lines.push(currentLine); // Agregar la línea completa
                }
                currentLine = words[i]; // Iniciar una nueva línea con la palabra actual
            }
        }

        if (currentLine) {
            lines.push(currentLine); // Agregar la última línea
        }

        return lines;
    }
}