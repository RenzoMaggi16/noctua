// =============================================
// Generador de QR — SOLO SERVER-SIDE
// =============================================
import QRCode from 'qrcode'
import type { DatosQR } from '@/types'

const QR_OPTIONS: QRCode.QRCodeToBufferOptions = {
  width: 400,
  margin: 2,
  color: {
    dark: '#1a0a00',
    light: '#f5f0e8',
  },
}

/**
 * Genera el QR como Buffer PNG — para adjuntar como CID en emails.
 * Los clientes como Gmail bloquean data: URIs pero respetan adjuntos CID.
 */
export async function generarQRBuffer(datos: DatosQR): Promise<Buffer> {
  const payload = JSON.stringify({
    codigo: datos.codigo,
    nombre: datos.nombre,
    mesa: datos.mesa,
    fecha: datos.fecha,
    hora: datos.hora,
    personas: datos.personas,
    restaurante: datos.restaurante,
  })

  return QRCode.toBuffer(payload, QR_OPTIONS)
}

/**
 * Genera el QR como string base64 (sin prefijo data:).
 * Útil para mostrar el QR en páginas web (img src="data:image/png;base64,...").
 */
export async function generarQRBase64(datos: DatosQR): Promise<string> {
  const buffer = await generarQRBuffer(datos)
  return buffer.toString('base64')
}
