import { TIME_ZONE_AMERICA_LIMA } from "./HParameter";

export default class HDate {
    /**
     * Convierte una cadena de texto (string) de fecha a una cadena de texto localizada, 
     * aplicando una zona horaria específica.
     * @param dateString - La cadena de texto de fecha a formatear.
     * @returns La fecha formateada como "Día de Mes del Año".
     */
    static convertStringDateToString(dateString: string): string {
        // 1. Convertir el string de fecha a un objeto Date
        const dateObject = new Date(dateString);

        // 2. Reutilizar el método existente para formatear la fecha
        // (que ya incluye la lógica de zona horaria y formato)
        return this.convertDateToString(dateObject);
    }

    /**
     * Convierte un objeto Date a una cadena de texto localizada, aplicando una zona horaria específica.
     * @param date - El objeto Date a formatear
     * @returns La fecha formateada como "Día de Mes del Año"
     */
    static convertDateToString(date: Date): string {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: TIME_ZONE_AMERICA_LIMA
        }

        const formatter = new Intl.DateTimeFormat('es-PE', options)

        const formatterDate = formatter.format(date)

        return formatterDate
        // return formatterDate.replace('de ', 'del ');

        // const meses = [
        //     "Enero",
        //     "Febrero",
        //     "Marzo",
        //     "Abril",
        //     "Mayo",
        //     "Junio",
        //     "Julio",
        //     "Agosto",
        //     "Setiembre",
        //     "Octubre",
        //     "Noviembre",
        //     "Diciembre"
        // ]

        // const dia = date.getDate()
        // const mes = meses[date.getMonth()]
        // const anio = date.getFullYear()

        // return `${dia} de ${mes} del ${anio}`
    }
}