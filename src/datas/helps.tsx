
interface FormatOptions {
    style: 'decimal' | 'percent' | 'currency';
    useGrouping: boolean;
    minimumFractionDigits: number;
    maximumFractionDigits: number;
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



interface DateFormatOptions {
    year?: 'numeric' | '2-digit';
    month?: 'numeric' | '2-digit' | 'narrow' | 'short' | 'long';
    day?: 'numeric' | '2-digit';
    hour?: 'numeric' | '2-digit';
    minute?: 'numeric' | '2-digit';
    second?: 'numeric' | '2-digit';
}

function formaterDateSelonLocale(date: Date, options?: DateFormatOptions): string {
    // Vérifier si l'argument est un objet Date valide
    if (!(date instanceof Date)) {
        return new Date('01/01/2025').toLocaleDateString();
    }

    // Options de formatage par défaut (si non fournies)
    const defaultOptions: DateFormatOptions = {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        hour: 'numeric', // Ajout de l'heure
        minute: 'numeric', // Ajout des minutes
        second: 'numeric', // Ajout des secondes
    };

    // Fusionner les options fournies avec les options par défaut
    const mergedOptions = { ...defaultOptions, ...options };

    // Formater la date et l'heure selon la locale et les options
    return date.toLocaleDateString(undefined, mergedOptions);
}
export { formaterDateSelonLocale };