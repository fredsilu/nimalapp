import moment from "moment";

interface FormatOptions {
    style: 'decimal' | 'percent' | 'currency';
    useGrouping: boolean;
    minimumFractionDigits: number;
    maximumFractionDigits: number;
}

interface DateFormatOptions {
    year?: 'numeric' | '2-digit';
    month?: 'numeric' | '2-digit' | 'narrow' | 'short' | 'long';
    day?: 'numeric' | '2-digit';
    hour?: 'numeric' | '2-digit';
    minute?: 'numeric' | '2-digit';
    second?: 'numeric' | '2-digit';
}

function formaterNombreSelonLocale(nombre: number): string {

    // Formater le nombre 
    const options: FormatOptions = {
        // Style de formatage (nombre, pourcentage, devise)
        style: 'decimal', // 'percent', 'currency'

        // Utilisation de séparateurs de groupes (milliers)
        useGrouping: true,

        // Nombre minimum de chiffres après la virgule
        minimumFractionDigits: 2,

        // Nombre maximum de chiffres après la virgule
        maximumFractionDigits: 3,
    };
    return new Intl.NumberFormat(undefined, options).format(nombre);
}
export { formaterNombreSelonLocale };



function formaterDateSelonLocale(date: Date, options?: DateFormatOptions): string {

    const current = moment(date, 'DD/MM/YYYY').format("DD/MM/YYYY");
    return (current);
}
export { formaterDateSelonLocale };

function formatDate(date: Date): string {

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const year = date.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
}
export { formatDate };

function formatDateLong(date: Date): string {

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return formattedDate;
}
export { formatDateLong };

