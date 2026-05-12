// =============================================
// Generador de código único de reserva NOCTUA
// Formato: NOC-XXXXXXXX (8 caracteres alfanuméricos)
// =============================================

const CARACTERES = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const LONGITUD_CODIGO = 8
const PREFIJO = 'NOC'

export function generarCodigoReserva(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(LONGITUD_CODIGO))
  const codigo = Array.from(bytes)
    .map((byte) => CARACTERES[byte % CARACTERES.length])
    .join('')
  return `${PREFIJO}-${codigo}`
}
