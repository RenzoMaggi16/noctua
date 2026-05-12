// =============================================
// Generador de QR — SOLO SERVER-SIDE
// =============================================
import QRCode from 'qrcode'
import type { DatosQR } from '@/types'

export async function generarQRBase64(datos: DatosQR): Promise<string> {
  const payload = JSON.stringify({
    codigo: datos.codigo,
    nombre: datos.nombre,
    mesa: datos.mesa,
    fecha: datos.fecha,
    hora: datos.hora,
    personas: datos.personas,
    restaurante: datos.restaurante,
  })

  const dataUrl = await QRCode.toDataURL(payload, {
    width: 400,
    margin: 2,
    color: {
      dark: '#1a0a00',
      light: '#f5f0e8',
    },
  })

  // Extraer solo la parte base64 (sin el prefijo data:image/png;base64,)
  const base64 = dataUrl.split(',')[1]
  return base64
}
