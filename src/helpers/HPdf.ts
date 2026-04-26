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
        try {// Definiendo el código
            let getCodigo: string = ""

            // Definiendo detalle de fechas del evento
            let textoFechasEvento: string = ""

            // Definiendo fechas del evento
            let fechasEvento: string[] = []

            // Definiendo un arreglo que guardará las líneas de impresión del nombre de alumno
            let linesNombreAlumno: string[] = []

            // Definiendo un arreglo que guardará las líneas de impresión del nombre del evento
            let linesTituloEvento: string[] = []

            let linesFechasEvento: string[] = []

            // Variables para los textos en el documento
            let fontSizeForNombreAlumno: number = 0

            let fontSizeForTituloEvento: number = 0

            let fontSizeForFechaEvento: number = 0

            let y: number = 0

            let x: number = 0

            let maxWidth: number = 0

            let lineWidthNombreAlumno: number = 0

            let lineHeightNombreAlumno: number = 0

            let lineWidthTituloEvento: number = 0

            let lineHeightTituloEvento: number = 0

            let lineWidthFechaEvento: number = 0

            let nombreAlumnoPositionX: number = 0

            let tituloEventoPositionX: number = 0

            let fechaEventoPositionX: number = 0

            // Obteniendo datos del formulario
            const {
                id_plantilla,
                nombre_impresion,
                id: idCertificado,
                codigo
            } = data

            // Obteniendo el ID de la plantilla
            const idPlantilla = id_plantilla as number

            // Obteniendo respuesta de la plantilla
            const responsePlantilla = await PlantillaRepository.getById(idPlantilla)

            // console.log({ responsePlantilla })

            const {
                result: resultPlantilla,
                data: dataPlantilla,
                message: messagePlantilla
            } = responsePlantilla

            if (!resultPlantilla && !dataPlantilla) {
                return { result: !resultPlantilla, message: messagePlantilla }
            }

            // Obteniendo ruta de la plantilla
            const { path: pathPlantilla } = dataPlantilla as IPlantilla

            // Obteniendo ruta absoluta de la plantilla
            const pathAbsoluteTemplate: string = path.resolve(__dirname, `../../public/pdf/${pathPlantilla}`)

            // console.log({ pathAbsoluteTemplate })

            // Obteniendo ruta absoluta de las fuentes
            const pathFontKuenstler: string = path.resolve(__dirname, '../../public/fonts/KUNSTLER.TTF')

            const pathFontKuenstlerBold: string = path.resolve(__dirname, "../../public/fonts/Kuenstler Script LT Std 2 Bold.otf");

            const pathFontBalooBold: string = path.resolve(__dirname, '../../public/fonts/BalooChettan2-Bold.ttf')

            const pathFontBalooMedium: string = path.resolve(__dirname, '../../public/fonts/BalooChettan2-Medium.ttf')

            const pathFontBroughton: string = path.resolve(__dirname, '../../public/fonts/Broughton.ttf')

            // Obteniendo ruta absoluta del logo
            const pathLogo: string = path.resolve(__dirname, '../../public/img/logo_transparente_small.png')

            // Validando si las plantillas existen
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

            if (!fs.existsSync(pathFontBroughton)) {
                return { result: false, message: `No existe fuente Broughton.ttf` }
            }

            // Validando si el logo existe
            if (!fs.existsSync(pathLogo)) {
                return { result: false, message: `No existe el logo` }
            }

            // Obteniendo propiedades del evento
            const {
                titulo,
                temario,
                fecha_inicio,
                fecha_fin,
                tipoEvento,
                duracion
            } = evento

            // console.log({ fecha_inicio })

            // console.log({ fecha_fin })

            // console.log({ duracion })

            // Definiendo el detalle de la fecha de eventos
            if (fecha_inicio && fecha_fin && duracion) {
                const fechaInicioStr = HDate.convertStringDateToString(fecha_inicio)

                const fechaFinalStr = HDate.convertStringDateToString(fecha_fin)

                const detalleDuracion = HString.completarConHoras(duracion)

                textoFechasEvento += (`Realizado del ${fechaInicioStr} al ${fechaFinalStr} `).trim()

                textoFechasEvento += `, con una duración de ${detalleDuracion}`
            }

            // console.log({ textoFechasEvento })

            const { nombre_url } = tipoEvento as ITipoEvento

            const nombreTipoEvento: string = nombre_url as string

            const { nombre_capitalized } = alumno

            const nombreImpresion: string = nombre_impresion as string;

            const tituloEvento: string = titulo as string

            const temarioEvento = temario?.split('\n') as String[]

            const setFecha: string | undefined = (!fecha_inicio) ? fecha_fin : fecha_inicio

            const fechaInicioStr: string = format(setFecha as string, "dd 'de' MMMM 'del' yyyy", { locale: es })

            const sanitizedTitulo: string = HString.sanitizeFileName(titulo as string)

            const sanitizedAlumno: string = HString.sanitizeFileName(nombre_capitalized as string)

            const codEvento: string = `${evento.id}`.toString().padStart(5, "0");

            const codAlumno: string = `${alumno.id}`.toString().padStart(5, "0");

            if (!idCertificado && !codigo) {
                getCodigo = HString.generateCodigo()
            } else {
                getCodigo = codigo as string
            }

            const filename: string = `certificado_e${codEvento}_a${codAlumno}_${getCodigo}.pdf`

            const outputPath: string = path.resolve(__dirname, `../../public/certificados/${sanitizedTitulo}/${filename}`)

            // console.log({ filename })

            // console.log({ outputPath })

            if (fecha_fin) {
                const fechaFinal = toZonedTime(fecha_fin, TIMEZONES.LIMA)

                const fechaFinalStr = format(fechaFinal, "dd 'de' MMMM 'del' yyyy", { locale: es })

                fechasEvento.push(`${fechaInicioStr} al`)

                fechasEvento.push(fechaFinalStr)
            } else {
                fechasEvento.push(`${fechaInicioStr}`)
            }

            // Verificando que el directorio de salida exista, sino se crea
            const outputDir: string = path.dirname(outputPath)

            // console.log({ outputDir })

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

            const fontBroughton = fs.readFileSync(pathFontBroughton)
            const customFontBroughton = await pdfDoc.embedFont(fontBroughton)

            // Obtener la primera página
            const pagina = pdfDoc.getPage(0)

            // Obtener el ancho de la página
            const pageWidth = pagina.getWidth()

            // console.log({ pageWidth })

            // console.log({ pathPlantilla })

            switch (pathPlantilla) {
                case "plantillas/plantilla_d.pdf":

                    // Configurar el texto del nombre del alumno
                    fontSizeForNombreAlumno = 48;

                    y = 345;  // Posición Y

                    // console.log({ y })

                    maxWidth = 720; // Ancho máximo disponible para el texto

                    // Distancia entre líneas para el nombre del alumno
                    lineHeightNombreAlumno = 0.8 * fontSizeForNombreAlumno;

                    // Dividir el nombre del alumno en líneas si excede el ancho máximo
                    linesNombreAlumno = this.splitTextIntoLines(nombreImpresion, maxWidth, customFontKuenstlerBold, fontSizeForNombreAlumno);

                    if (linesNombreAlumno.length > 1) {
                        fontSizeForNombreAlumno = 44;
                    }

                    // Dibujar el nombre del alumno centrado
                    for (let i = 0; i < linesNombreAlumno.length; i++) {
                        lineWidthNombreAlumno = customFontKuenstlerBold.widthOfTextAtSize(linesNombreAlumno[i], fontSizeForNombreAlumno);

                        // const nombrePositionX = (pageWidth - lineWidthNombreAlumno) / 2;  // Centrado horizontal
                        nombreAlumnoPositionX = (pageWidth - lineWidthNombreAlumno) / 2;

                        pagina.drawText(linesNombreAlumno[i], {
                            x: nombreAlumnoPositionX,
                            y: y - i * lineHeightNombreAlumno,
                            size: fontSizeForNombreAlumno,
                            font: customFontKuenstlerBold,
                            color: rgb(0, 0, 0),
                        });
                    }

                    // Configurar el texto del título del evento
                    fontSizeForTituloEvento = 30;

                    maxWidth = 480

                    y -= 90; // Ajustar la posición Y para el siguiente texto

                    // console.log({ y })

                    // Distancia entre líneas para el nombre del evento
                    lineHeightTituloEvento = 0.8 * fontSizeForTituloEvento;

                    // Dividir el título del evento si es necesario
                    linesTituloEvento = this.splitTextIntoLines(tituloEvento, maxWidth, customFontBalooBold, fontSizeForTituloEvento);

                    // console.log({ linesTituloEvento })

                    for (let i = 0; i < linesTituloEvento.length; i++) {
                        lineWidthTituloEvento = customFontBalooBold.widthOfTextAtSize(linesTituloEvento[i], fontSizeForTituloEvento);

                        tituloEventoPositionX = (pageWidth - lineWidthTituloEvento) / 2;  // Centrado horizontal

                        // Dibujar el título del evento centrado
                        pagina.drawText(linesTituloEvento[i], {
                            x: tituloEventoPositionX,
                            y: y - i * lineHeightTituloEvento,
                            size: fontSizeForTituloEvento,
                            font: customFontBalooBold,
                            color: rgb(0 / 255, 32 / 255, 58 / 255),
                        });
                    }

                    // Configurar el texto de la fecha del evento
                    fontSizeForFechaEvento = 24;

                    y -= 50
                    // console.log({ y })

                    for (let i = 0; i < fechasEvento.length; i++) {
                        let detailTextoFecha = fechasEvento[i]

                        // console.log({ detailTextoFecha })

                        lineWidthFechaEvento = customFontBalooMedium.widthOfTextAtSize(fechasEvento[i], fontSizeForFechaEvento);

                        fechaEventoPositionX = (pageWidth - lineWidthFechaEvento) / 2;

                        pagina.drawText(detailTextoFecha, {
                            x: fechaEventoPositionX,
                            y: y - i * lineHeightTituloEvento, // Ajustar la posición vertical para cada línea
                            size: fontSizeForFechaEvento,
                            font: customFontBalooMedium,
                            color: rgb(222 / 255, 148 / 255, 40 / 255),
                        });
                    }
                    break;
                case "plantillas/plantilla_primer_congreso_internacional_2025.pdf":
                case "plantillas/plantilla_primer_congreso_internacional_2025_sin_firma.pdf":
                    // Configurar el texto del nombre del alumno
                    fontSizeForNombreAlumno = 56;

                    y = 280;  // Posición Y
                    maxWidth = 540; // Ancho máximo disponible para el texto

                    // Distancia entre líneas para el nombre del alumno
                    lineHeightNombreAlumno = 0.8 * fontSizeForNombreAlumno;

                    // Dividir el nombre del alumno en líneas si excede el ancho máximo
                    linesNombreAlumno = this.splitTextIntoLines(nombreImpresion, maxWidth, customFontKuenstlerBold, fontSizeForNombreAlumno);

                    if (linesNombreAlumno.length > 1) {
                        fontSizeForNombreAlumno = 52;
                        y += 20;
                    }

                    // Dibujar el nombre del alumno centrado
                    for (let i = 0; i < linesNombreAlumno.length; i++) {
                        lineWidthNombreAlumno = customFontKuenstlerBold.widthOfTextAtSize(linesNombreAlumno[i], fontSizeForNombreAlumno);

                        // const nombrePositionX = (pageWidth - lineWidthNombreAlumno) / 2;  // Centrado horizontal
                        nombreAlumnoPositionX = (pageWidth - lineWidthNombreAlumno) / 2;

                        pagina.drawText(linesNombreAlumno[i], {
                            x: nombreAlumnoPositionX,
                            y: y - i * lineHeightNombreAlumno,
                            size: fontSizeForNombreAlumno,
                            font: customFontKuenstlerBold,
                            color: rgb(0, 0, 0),
                        });
                    }
                    break
                case "plantillas/diploma_especializacion.pdf":
                    // Configurar el texto del nombre del alumno

                    y = 330;  // Posición Y

                    fontSizeForNombreAlumno = 46

                    maxWidth = 520; // Ancho máximo disponible para el texto

                    lineHeightNombreAlumno = 0.8 * fontSizeForNombreAlumno;

                    // Dividir el nombre del alumno en líneas si excede el ancho máximo
                    linesNombreAlumno = this.splitTextIntoLines(nombreImpresion, maxWidth, customFontKuenstlerBold, fontSizeForNombreAlumno);

                    if (linesNombreAlumno.length === 1) {
                        fontSizeForNombreAlumno = 50
                    } else {
                        y = 340
                    }

                    // Dibujar el nombre del alumno centrado
                    for (let i = 0; i < linesNombreAlumno.length; i++) {
                        lineWidthNombreAlumno = customFontKuenstlerBold.widthOfTextAtSize(linesNombreAlumno[i], fontSizeForNombreAlumno);

                        // const nombrePositionX = ((pageWidth - lineWidthNombreAlumno) / 2) + 110;  // Centrado horizontal
                        nombreAlumnoPositionX = ((pageWidth - lineWidthNombreAlumno) / 2) + 110

                        pagina.drawText(linesNombreAlumno[i], {
                            x: nombreAlumnoPositionX,
                            y: y - i * lineHeightNombreAlumno,
                            size: fontSizeForNombreAlumno,
                            font: customFontKuenstlerBold,
                            color: rgb(0, 0, 0),
                        });
                    }

                    // Configurar el texto del título del evento
                    fontSizeForTituloEvento = 26;

                    tituloEventoPositionX = ((pageWidth - lineWidthTituloEvento) / 2) - 60

                    if (linesNombreAlumno.length === 1) {
                        y -= 70
                    } else {
                        y -= 78
                    }

                    pagina.drawText(tituloEvento, {
                        x: tituloEventoPositionX,
                        y,
                        size: fontSizeForTituloEvento,
                        font: customFontBalooBold,
                        color: rgb(0 / 255, 32 / 255, 58 / 255),
                    });
                    break
                case "plantillas/plantilla_capacitacion_edicion_completa.pdf":
                    // Configurar el texto del nombre del alumno

                    y = 340;  // Posición Y

                    fontSizeForNombreAlumno = 50

                    maxWidth = 800; // Ancho máximo disponible para el texto

                    lineHeightNombreAlumno = 0.8 * fontSizeForNombreAlumno;

                    // Dividir el nombre del alumno en líneas si excede el ancho máximo
                    linesNombreAlumno = this.splitTextIntoLines(nombreImpresion, maxWidth, customFontKuenstlerBold, fontSizeForNombreAlumno);

                    if (linesNombreAlumno.length > 1) {
                        y = 335
                        fontSizeForNombreAlumno = 46
                    }

                    // Dibujar el nombre del alumno centrado
                    for (let i = 0; i < linesNombreAlumno.length; i++) {
                        lineWidthNombreAlumno = customFontKuenstlerBold.widthOfTextAtSize(linesNombreAlumno[i], fontSizeForNombreAlumno);

                        // const nombrePositionX = ((pageWidth - lineWidthAlumno) / 2);  // Centrado horizontal
                        nombreAlumnoPositionX = (pageWidth - lineWidthNombreAlumno) / 2;

                        pagina.drawText(linesNombreAlumno[i], {
                            x: nombreAlumnoPositionX,
                            y: y - i * lineHeightNombreAlumno,
                            size: fontSizeForNombreAlumno,
                            font: customFontKuenstlerBold,
                            color: rgb(0, 0, 0),
                        });
                    }

                    // Configurar el texto del título del evento
                    fontSizeForTituloEvento = 32;

                    maxWidth = 520

                    if (fecha_inicio === null && fecha_fin === null) {
                        y -= 90
                    } else {
                        y -= 72;
                    }

                    // console.log({ y })

                    // Distancia entre líneas para el nombre del evento
                    lineHeightTituloEvento = 0.9 * fontSizeForTituloEvento;

                    // Dividir el título del evento si es necesario
                    linesTituloEvento = this.splitTextIntoLines(tituloEvento, maxWidth, customFontBalooBold, fontSizeForTituloEvento);

                    for (let i = 0; i < linesTituloEvento.length; i++) {
                        lineWidthTituloEvento = customFontBalooBold.widthOfTextAtSize(linesTituloEvento[i], fontSizeForTituloEvento);

                        tituloEventoPositionX = (pageWidth - lineWidthTituloEvento) / 2;  // Centrado horizontal

                        // Dibujar el título del evento centrado
                        pagina.drawText(linesTituloEvento[i], {
                            x: tituloEventoPositionX,
                            y: y - i * lineHeightTituloEvento,
                            size: fontSizeForTituloEvento,
                            font: customFontBalooBold,
                            color: rgb(0 / 255, 32 / 255, 58 / 255),
                        });
                    }

                    if (fecha_inicio !== null && fecha_fin !== null) {
                        // Configurar el texto de la fecha del evento
                        fontSizeForFechaEvento = 24;

                        if (linesTituloEvento.length === 1) {
                            y -= 40
                        } else {
                            y -= 58

                            lineHeightTituloEvento = 0.8 * fontSizeForTituloEvento;
                        }

                        // Dividir el título del evento si es necesario
                        linesFechasEvento = this.splitTextIntoLines(textoFechasEvento, maxWidth, customFontBalooBold, fontSizeForFechaEvento);

                        for (let i = 0; i < linesFechasEvento.length; i++) {
                            lineWidthTituloEvento = customFontBalooMedium.widthOfTextAtSize(linesFechasEvento[i], fontSizeForFechaEvento);

                            fechaEventoPositionX = (pageWidth - lineWidthTituloEvento) / 2;  // Centrado horizontal

                            // Dibujar el título del evento centrado
                            pagina.drawText(linesFechasEvento[i], {
                                x: fechaEventoPositionX,
                                y: y - i * lineHeightTituloEvento,
                                size: fontSizeForFechaEvento,
                                font: customFontBalooMedium,
                                color: rgb(222 / 255, 148 / 255, 40 / 255),
                            });
                        }
                    }
                    break
                case "plantillas/diploma_especializacion_edicion_completa.pdf":
                    // Configurar el texto del nombre del alumno

                    y = 340;  // Posición Y

                    fontSizeForNombreAlumno = 36

                    maxWidth = 440; // Ancho máximo disponible para el texto

                    // Dividir el nombre del alumno en líneas si excede el ancho máximo
                    linesNombreAlumno = this.splitTextIntoLines(nombreImpresion, maxWidth + 100, customFontKuenstlerBold, fontSizeForNombreAlumno);

                    // console.log({ linesNombreAlumno })

                    if (linesNombreAlumno.length === 1) {
                        fontSizeForNombreAlumno = 44
                    } else {
                        y = 360
                    }

                    // console.log({ y })

                    // console.log({ fontSizeForNombreAlumno })

                    lineHeightNombreAlumno = 0.9 * fontSizeForNombreAlumno;

                    // console.log({ lineHeightNombreAlumno })

                    // Dibujar el nombre del alumno centrado
                    for (let i = 0; i < linesNombreAlumno.length; i++) {
                        lineWidthNombreAlumno = customFontKuenstlerBold.widthOfTextAtSize(linesNombreAlumno[i], fontSizeForNombreAlumno);

                        let nombreAlumnoPositionX = 0

                        if (linesNombreAlumno.length > 1) {
                            nombreAlumnoPositionX = ((pageWidth - lineWidthNombreAlumno) / 2) + 120
                        } else {
                            nombreAlumnoPositionX = ((pageWidth - lineWidthNombreAlumno) / 2) + 100
                        }

                        // const nombrePositionX = ((pageWidth - lineWidthNombreAlumno) / 2) + 110;  // Centrado horizontal
                        // const nombreAlumnoPositionX = ((pageWidth - lineWidthNombreAlumno) / 2) + 100;

                        // console.log({ nombreAlumnoPositionX })

                        pagina.drawText(linesNombreAlumno[i], {
                            x: nombreAlumnoPositionX,
                            y: y - i * lineHeightNombreAlumno,
                            size: fontSizeForNombreAlumno,
                            font: customFontKuenstlerBold,
                            color: rgb(0, 0, 0),
                        });
                    }

                    // Configurar el texto del título del evento
                    fontSizeForTituloEvento = 28;

                    linesTituloEvento = this.splitTextIntoLines(tituloEvento, maxWidth - 80, customFontKuenstlerBold, fontSizeForTituloEvento);

                    if (linesTituloEvento.length === 1) {
                        fontSizeForTituloEvento = 30
                    }

                    if (linesNombreAlumno.length > 1) {
                        // console.log('aa')
                        // y -= 70
                        y -= 90
                    } else {
                        // console.log('bb')
                        y -= 80
                        // y -= 90
                    }

                    // console.log({ tituloEvento })
                    // console.log({ linesTituloEvento })
                    // console.log({ y })

                    // Distancia entre líneas para el nombre del evento
                    lineHeightTituloEvento = 0.8 * fontSizeForTituloEvento;

                    // Dibujar el nombre del evento centrado
                    for (let i = 0; i < linesTituloEvento.length; i++) {
                        const getItemTitulo = linesTituloEvento[i]
                        // console.log({ getItemTitulo })
                        // lineWidthNombreAlumno = customFontKuenstlerBold.widthOfTextAtSize(linesNombreAlumno[i], fontSizeForNombreAlumno);

                        // const nombrePositionX = ((pageWidth - lineWidthNombreAlumno) / 2) + 110;  // Centrado horizontal
                        // nombreAlumnoPositionX = ((pageWidth - lineWidthNombreAlumno) / 2) + 100;
                        lineWidthTituloEvento = customFontKuenstlerBold.widthOfTextAtSize(getItemTitulo, fontSizeForTituloEvento);

                        tituloEventoPositionX = (pageWidth - lineWidthTituloEvento) - 230;

                        pagina.drawText(getItemTitulo, {
                            x: tituloEventoPositionX,
                            y: y - i * lineHeightTituloEvento,
                            size: fontSizeForTituloEvento,
                            font: customFontBalooBold,
                            color: rgb(0 / 255, 32 / 255, 58 / 255)
                        });
                    }

                    fontSizeForFechaEvento = 22;

                    maxWidth += 60

                    // Dividir el título del evento si es necesario
                    linesFechasEvento = this.splitTextIntoLines(textoFechasEvento, maxWidth, customFontBalooBold, fontSizeForFechaEvento);

                    // console.log({ linesFechasEvento })

                    if (linesTituloEvento.length > 1) {
                        // console.log('cc')
                        y -= 140
                    } else {
                        // console.log('dd')
                        y -= 130
                    }

                    if (linesFechasEvento.length > 1) {
                        y += 20
                        fontSizeForFechaEvento = 20
                    }

                    // console.log({ linesFechasEvento })

                    for (let i = 0; i < linesFechasEvento.length; i++) {
                        lineWidthFechaEvento = customFontBalooMedium.widthOfTextAtSize(linesFechasEvento[i], fontSizeForFechaEvento);

                        // tituloEventoPositionX = ((pageWidth - lineWidthTituloEvento) / 2) - 20;  // Centrado horizontal
                        fechaEventoPositionX = 310

                        // Dibujar el título del evento centrado
                        pagina.drawText(linesFechasEvento[i], {
                            x: fechaEventoPositionX,
                            y: y - i * lineHeightTituloEvento,
                            size: fontSizeForFechaEvento,
                            font: customFontBalooMedium,
                            color: rgb(222 / 255, 148 / 255, 40 / 255),
                        });
                    }
                    break
                case "plantillas/certificado_Diploma_de_Especializacion_Tacna.pdf":
                    // Configurar el texto del nombre del alumno

                    y = 340;  // Posición Y

                    fontSizeForNombreAlumno = 36

                    maxWidth = 440; // Ancho máximo disponible para el texto

                    // Dividir el nombre del alumno en líneas si excede el ancho máximo
                    linesNombreAlumno = this.splitTextIntoLines(nombreImpresion, maxWidth + 100, customFontKuenstlerBold, fontSizeForNombreAlumno);

                    // console.log({ linesNombreAlumno })

                    if (linesNombreAlumno.length === 1) {
                        fontSizeForNombreAlumno = 44
                    } else {
                        y = 360
                    }

                    // console.log('---- posición y inicial ----')
                    // console.log({ y })

                    // console.log({ fontSizeForNombreAlumno })

                    lineHeightNombreAlumno = 0.9 * fontSizeForNombreAlumno;

                    // Dibujar el nombre del alumno centrado
                    for (let i = 0; i < linesNombreAlumno.length; i++) {
                        lineWidthNombreAlumno = customFontKuenstlerBold.widthOfTextAtSize(linesNombreAlumno[i], fontSizeForNombreAlumno);

                        let nombreAlumnoPositionX = 0

                        if (linesNombreAlumno.length > 1) {
                            nombreAlumnoPositionX = ((pageWidth - lineWidthNombreAlumno) / 2) + 120
                        } else {
                            nombreAlumnoPositionX = ((pageWidth - lineWidthNombreAlumno) / 2) + 100
                        }

                        // const nombrePositionX = ((pageWidth - lineWidthNombreAlumno) / 2) + 110;  // Centrado horizontal
                        // const nombreAlumnoPositionX = ((pageWidth - lineWidthNombreAlumno) / 2) + 120;

                        pagina.drawText(linesNombreAlumno[i], {
                            x: nombreAlumnoPositionX,
                            y: y - i * lineHeightNombreAlumno,
                            size: fontSizeForNombreAlumno,
                            font: customFontKuenstlerBold,
                            color: rgb(0, 0, 0),
                        });
                    }

                    // Configurar el texto del título del evento
                    fontSizeForTituloEvento = 28;

                    linesTituloEvento = this.splitTextIntoLines(tituloEvento, maxWidth - 100, customFontKuenstlerBold, fontSizeForTituloEvento);
                    // console.log({ linesTituloEvento })

                    // console.log({ tituloEvento })
                    // console.log({ linesTituloEvento })

                    if (linesTituloEvento.length === 1) {
                        fontSizeForTituloEvento = 30
                    }

                    if (linesNombreAlumno.length > 1) {
                        // console.log('aa')
                        // y -= 70
                        y -= 90
                    } else {
                        // console.log('bb')
                        y -= 80
                        // y -= 90
                    }

                    // console.log({ tituloEvento })
                    // console.log({ linesTituloEvento })
                    // console.log({ y })

                    // Distancia entre líneas para el nombre del evento
                    lineHeightTituloEvento = 0.8 * fontSizeForTituloEvento;

                    // Dibujar el nombre del evento centrado
                    for (let i = 0; i < linesTituloEvento.length; i++) {
                        const getItemTitulo = linesTituloEvento[i]
                        // console.log({ getItemTitulo })
                        // lineWidthNombreAlumno = customFontKuenstlerBold.widthOfTextAtSize(linesNombreAlumno[i], fontSizeForNombreAlumno);

                        // const nombrePositionX = ((pageWidth - lineWidthNombreAlumno) / 2) + 110;  // Centrado horizontal
                        // nombreAlumnoPositionX = ((pageWidth - lineWidthNombreAlumno) / 2) + 100;
                        lineWidthTituloEvento = customFontKuenstlerBold.widthOfTextAtSize(getItemTitulo, fontSizeForTituloEvento);

                        tituloEventoPositionX = (pageWidth - lineWidthTituloEvento) - 230;

                        pagina.drawText(getItemTitulo, {
                            x: tituloEventoPositionX,
                            y: y - i * lineHeightTituloEvento,
                            size: fontSizeForTituloEvento,
                            font: customFontBalooBold,
                            color: rgb(0 / 255, 32 / 255, 58 / 255)
                        });
                    }

                    fontSizeForFechaEvento = 22;

                    maxWidth += 60

                    // Dividir el título del evento si es necesario
                    linesFechasEvento = this.splitTextIntoLines(textoFechasEvento, maxWidth, customFontBalooBold, fontSizeForFechaEvento);

                    // console.log({ linesFechasEvento })

                    if (linesTituloEvento.length > 1) {
                        // console.log('---- a ----')
                        y -= 140
                    } else {
                        // console.log('---- b ----')
                        y -= 130
                    }

                    // console.log('---- posición y linesTituloEvento ----')
                    // console.log({ y })

                    if (linesFechasEvento.length > 1) {
                        y += 20
                        fontSizeForFechaEvento = 20
                    }

                    for (let i = 0; i < linesFechasEvento.length; i++) {
                        lineWidthFechaEvento = customFontBalooMedium.widthOfTextAtSize(linesFechasEvento[i], fontSizeForFechaEvento);

                        // tituloEventoPositionX = ((pageWidth - lineWidthTituloEvento) / 2) - 20;  // Centrado horizontal
                        fechaEventoPositionX = 310

                        // Dibujar el título del evento centrado
                        pagina.drawText(linesFechasEvento[i], {
                            x: fechaEventoPositionX,
                            y: y - i * lineHeightTituloEvento,
                            size: fontSizeForFechaEvento,
                            font: customFontBalooMedium,
                            color: rgb(222 / 255, 148 / 255, 40 / 255),
                        });
                    }
                    break
                case 'plantillas/certificado_participacion_con_firma.pdf':
                case 'plantillas/certificado_participacion_sin_firma.pdf':
                    // Configurar el texto del nombre del alumno

                    y = 320;  // Posición Y

                    const anchoNombreImpresion = nombreImpresion.length
                    // console.log({ nombreImpresion })
                    // console.log({ anchoNombreImpresion })

                    fontSizeForNombreAlumno = 50

                    if (anchoNombreImpresion <= 33) {
                        fontSizeForNombreAlumno = 54
                    }

                    maxWidth = 600; // Ancho máximo disponible para el texto

                    // Dividir el nombre del alumno en líneas si excede el ancho máximo
                    linesNombreAlumno = this.splitTextIntoLines(nombreImpresion, maxWidth, customFontKuenstlerBold, fontSizeForNombreAlumno);

                    // console.log({ linesNombreAlumno })

                    if (linesNombreAlumno.length !== 1) {
                        y = 340
                    }

                    // console.log('---- posición y inicial ----')
                    // console.log({ y })

                    // console.log({ fontSizeForNombreAlumno })

                    lineHeightNombreAlumno = 0.9 * fontSizeForNombreAlumno;

                    // console.log({ lineHeightNombreAlumno })

                    // Dibujar el nombre del alumno centrado
                    for (let i = 0; i < linesNombreAlumno.length; i++) {
                        lineWidthNombreAlumno = customFontKuenstlerBold.widthOfTextAtSize(linesNombreAlumno[i], fontSizeForNombreAlumno);
                        // console.log({ lineWidthNombreAlumno })

                        let nombreAlumnoPositionX = 0

                        if (linesNombreAlumno.length > 1) {
                            // console.log('aa')
                            nombreAlumnoPositionX = ((pageWidth - lineWidthNombreAlumno) / 2) + 120
                        } else {
                            // console.log('bb')
                            nombreAlumnoPositionX = ((pageWidth - lineWidthNombreAlumno) / 2) + 100
                        }

                        // console.log({ nombreAlumnoPositionX })

                        // const nombrePositionX = ((pageWidth - lineWidthNombreAlumno) / 2) + 110;  // Centrado horizontal
                        // const nombreAlumnoPositionX = ((pageWidth - lineWidthNombreAlumno) / 2) + 120;

                        pagina.drawText(linesNombreAlumno[i], {
                            x: nombreAlumnoPositionX,
                            y: y - i * lineHeightNombreAlumno,
                            size: fontSizeForNombreAlumno,
                            font: customFontKuenstlerBold,
                            color: rgb(0 / 255, 0 / 255, 0 / 255)
                        });
                    }
                    break
            }

            // Crear nueva página para el logo, código QR y tabla
            const newPageWidth = 842

            const newPageHeight = 590

            const newPage = pdfDoc.addPage([newPageWidth, newPageHeight]);

            const heightPage = newPage.getHeight()
            // console.log({ heightPage })

            // Crear un rectángulo para texto introductorio
            const startX = 20

            const startY = heightPage - 170
            // console.log({ startY })

            const cellWidth = (nombreTipoEvento !== 'diploma-de-especializacion') ? 450 : 270

            const cellHeight = (nombreTipoEvento !== 'diploma-de-especializacion') ? 50 : 155

            // console.log('---- página 2 ----')
            // console.log({ cellWidth })
            // console.log({ cellHeight })

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

            // console.log({ texto })

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
            const cellWidthTemario = (nombreTipoEvento !== 'diploma-de-especializacion') ? 450 : 300
            const cellHeightTemario = 20

            // console.log({ startTemarioY })
            // console.log({ cellWidthTemario })

            // Dibujar celda para el título del evento
            newPage.drawRectangle({
                x: startTemarioX,
                y: (startTemarioY + 40),
                width: cellWidthTemario + 50,
                height: cellHeightTemario,
                color: rgb(1, 1, 1),
            });

            // Dibujar el título del evento en la celda
            newPage.drawText(tituloEvento, {
                x: startTemarioX + 5,
                y: (startTemarioY + 45),
                size: 14,
                font: customFontBalooBold,
                color: rgb(0 / 255, 32 / 255, 58 / 255)
            });

            startTemarioY = startTemarioY - 30
            // console.log({ startTemarioY })

            // Dibujar celda para el título del temario
            newPage.drawRectangle({
                x: startTemarioX,
                y: startTemarioY + 40,
                width: cellWidthTemario,
                height: cellHeightTemario,
                borderColor: rgb(0, 0, 0),
                borderWidth: 1,
                color: rgb(1, 1, 1),
            });

            newPage.drawText('Temario', {
                x: startTemarioX + 5,
                y: startTemarioY + 45,
                size: 12,
                color: rgb(0, 0, 0),
            });

            // Ajustar la posición para los ítems del temario
            // let currentY = 0
            let currentY = startTemarioY + 35

            if (temarioEvento.length > 0) {

                temarioEvento.forEach((item, index) => {

                    // if (index == 0) {
                    //     currentY = startTemarioY - index * (cellHeightTemario + 3)
                    // }

                    // Dividir cada ítem del temario
                    const linesItemTemario = this.splitTextIntoLines(item as string, 260, customFontKuenstler, 12);

                    if (linesItemTemario.length > 0) {
                        for (let i = 0; i < linesItemTemario.length; i++) {
                            currentY -= 12

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

            // console.log('--- hasta aquí pasó ---')

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
        // console.log({ words })
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