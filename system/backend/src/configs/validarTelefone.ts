export function validarTelefone(numero: string): boolean {
    const somenteNumeros = numero.replace(/\D/g, '');

    if (!somenteNumeros.startsWith('55')) return false;

    if (somenteNumeros.length < 12 || somenteNumeros.length > 13) return false;

    return true;
}