import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { generarCodigoReserva } from '@/lib/generarCodigo'
import { generarQRBase64 } from '@/lib/generarQR'
import type { MesaEstado } from '@/types'

// =============================================
// Clientes server-side (no singleton en API routes)
// =============================================
function crearSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

function crearResend() {
  return new Resend(process.env.RESEND_API_KEY!)
}

// =============================================
// Template de email HTML (estilos inline)
// =============================================
function generarEmailHTML(params: {
  nombre: string
  mesaNumero: number
  fecha: string
  hora: string
  personas: number
  codigo: string
  qrBase64: string
}): string {
  const { nombre, mesaNumero, fecha, hora, personas, codigo, qrBase64 } = params

  const formatearFecha = (f: string) => {
    try {
      const [year, month, day] = f.split('-')
      const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
      return `${day} de ${meses[parseInt(month, 10) - 1]} de ${year}`
    } catch {
      return f
    }
  }

  const filaDetalle = (etiqueta: string, valor: string, fondo: string) =>
    `<tr style="background:${fondo}">
      <td style="padding:10px 16px;color:#8a7a6a;font-size:12px;font-family:Arial,sans-serif;text-transform:uppercase;letter-spacing:1px;width:40%">${etiqueta}</td>
      <td style="padding:10px 16px;color:#f5f0e8;font-size:14px;font-family:Arial,sans-serif;font-weight:500">${valor}</td>
    </tr>`

  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Reserva NOCTUA — ${codigo}</title></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:Arial,Helvetica,sans-serif">
  <div style="max-width:600px;margin:0 auto;background:#0D0D0D">

    <!-- Header -->
    <div style="background:#1A0A00;padding:40px 40px 32px;border-bottom:1px solid #C9A96E">
      <div style="text-align:center">
        <p style="font-size:38px;color:#C9A96E;margin:0;font-family:Georgia,'Times New Roman',serif;letter-spacing:8px;font-weight:400">NOCTUA</p>
        <p style="font-size:13px;color:#9a8464;margin:10px 0 0;font-style:italic;font-family:Georgia,serif;letter-spacing:2px">Una experiencia que no se olvida.</p>
      </div>
    </div>

    <!-- Cuerpo -->
    <div style="padding:40px">
      <h1 style="color:#C9A96E;font-size:24px;margin:0 0 8px;font-family:Georgia,serif;font-weight:400">¡Tu reserva está confirmada!</h1>
      <p style="color:#9a8464;font-size:14px;margin:0 0 28px">Número de reserva: <strong style="color:#C9A96E;font-family:'Courier New',monospace;font-size:15px">${codigo}</strong></p>

      <p style="color:#c5bfb5;font-size:15px;line-height:1.6;margin:0 0 24px">
        Hola <strong style="color:#f5f0e8">${nombre}</strong>,<br><br>
        Nos alegra confirmar tu reserva en NOCTUA. Te esperamos para brindarte una experiencia gastronómica inolvidable.
      </p>

      <!-- Tabla de detalles -->
      <table style="width:100%;border-collapse:collapse;margin-bottom:32px;border:1px solid #2a1a0a">
        ${filaDetalle('Mesa', `Mesa ${mesaNumero}`, '#1a0f07')}
        ${filaDetalle('Fecha', formatearFecha(fecha), '#0f0a05')}
        ${filaDetalle('Horario', `${hora} horas`, '#1a0f07')}
        ${filaDetalle('Personas', `${personas} persona${personas > 1 ? 's' : ''}`, '#0f0a05')}
        ${filaDetalle('Código', codigo, '#1a0f07')}
      </table>

      <!-- Separador -->
      <div style="height:1px;background:linear-gradient(to right,transparent,#C9A96E,transparent);margin:32px 0"></div>

      <!-- Sección QR -->
      <div style="text-align:center;padding:16px 0">
        <h2 style="color:#C9A96E;font-size:18px;margin:0 0 8px;font-family:Georgia,serif;font-weight:400">Tu código QR de reserva</h2>
        <p style="color:#7a6a5a;font-size:13px;margin:0 0 24px">Presentá este código al llegar al restaurante</p>
        <img
          src="data:image/png;base64,${qrBase64}"
          width="200"
          height="200"
          alt="Código QR de reserva NOCTUA ${codigo}"
          style="display:block;margin:0 auto;border:8px solid #1A0A00"
        />
        <p style="color:#5a4a3a;font-size:11px;margin:16px 0 0;font-style:italic">
          Este QR contiene todos los datos de tu reserva.
        </p>
      </div>

      <!-- Separador -->
      <div style="height:1px;background:linear-gradient(to right,transparent,#C9A96E,transparent);margin:32px 0"></div>

      <!-- Info importante -->
      <div style="background:#1a0a00;padding:16px 20px;border-left:3px solid #C9A96E;margin-bottom:32px">
        <p style="color:#9a8464;font-size:13px;margin:0;line-height:1.6">
          <strong style="color:#C9A96E">Recordatorio:</strong> En caso de no poder asistir, por favor cancelá tu reserva con al menos 2 horas de anticipación al <a href="tel:+541148000000" style="color:#C9A96E">+54 11 4800-0000</a>.
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background:#0f0a05;padding:28px 40px;border-top:1px solid #2a1a0a">
      <div style="text-align:center">
        <p style="color:#C9A96E;font-size:16px;margin:0 0 6px;font-family:Georgia,serif;letter-spacing:4px">NOCTUA</p>
        <p style="color:#5a4a3a;font-size:12px;margin:0 0 4px">Av. Alvear 1420, Recoleta, Buenos Aires</p>
        <p style="color:#5a4a3a;font-size:12px;margin:0 0 4px"><a href="tel:+541148000000" style="color:#7a6a5a">+54 11 4800-0000</a></p>
        <p style="color:#3a2a1a;font-size:11px;margin:16px 0 0">© 2025 NOCTUA. Todos los derechos reservados.</p>
        <p style="color:#3a2a1a;font-size:10px;margin:6px 0 0;font-style:italic">Este es un email automático. No respondas a este mensaje.</p>
      </div>
    </div>

  </div>
</body>
</html>`
}

// =============================================
// POST /api/reservas
// =============================================
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // --- PASO 1: Validar campos requeridos ---
    const camposRequeridos = [
      'mesa_id', 'nombre_cliente', 'email_cliente',
      'telefono', 'cantidad_personas', 'fecha', 'hora'
    ]
    for (const campo of camposRequeridos) {
      if (!body[campo] && body[campo] !== 0) {
        return NextResponse.json(
          { error: `El campo "${campo.replace('_', ' ')}" es obligatorio.` },
          { status: 400 }
        )
      }
    }

    const {
      mesa_id,
      mesas_ids,
      nombre_cliente,
      email_cliente,
      telefono,
      cantidad_personas,
      fecha,
      hora,
    } = body as {
      mesa_id: string
      mesas_ids?: string[]
      nombre_cliente: string
      email_cliente: string
      telefono: string
      cantidad_personas: number
      fecha: string
      hora: string
    }

    // --- PASO 2: Verificar disponibilidad de mesa ---
    const supabase = crearSupabase()
    
    const { data: mesaDb, error: mesaDbError } = await supabase
      .from('mesas')
      .select('id, numero, estado')
      .eq('id', mesa_id)
      .single()

    if (mesaDbError || !mesaDb) {
      return NextResponse.json(
        { error: 'Mesa no encontrada en la base de datos.' },
        { status: 404 }
      )
    }

    const mesaNumero = mesaDb.numero

    // --- PASO 3: Generar código único ---
    const codigo = generarCodigoReserva()

    // Insertar reserva
    // Si hay mesas combinadas, guardamos el array de IDs
    const { error: insertError } = await supabase
      .from('reservas')
      .insert({
        mesa_id,
        mesas_ids: mesas_ids || [mesa_id],
        nombre_cliente,
        email_cliente,
        telefono,
        cantidad_personas,
        fecha,
        hora,
        codigo_reserva: codigo,
      })

    if (insertError) {
      console.error('Error al insertar reserva:', insertError)
      return NextResponse.json(
        { 
          error: 'No se pudo registrar la reserva en la base de datos.',
          details: insertError.message,
          code: insertError.code,
          hint: insertError.hint
        },
        { status: 500 }
      )
    }

    // --- PASO 4: Generar QR base64 ---
    const qrBase64 = await generarQRBase64({
      codigo,
      nombre: nombre_cliente,
      mesa: mesaNumero,
      fecha,
      hora,
      personas: cantidad_personas,
      restaurante: 'NOCTUA',
    })

    // --- PASO 5: Enviar email con Resend ---
    const resend = crearResend()
    const htmlEmail = generarEmailHTML({
      nombre: nombre_cliente,
      mesaNumero,
      fecha,
      hora,
      personas: cantidad_personas,
      codigo,
      qrBase64,
    })

    await resend.emails.send({
      from: 'NOCTUA Restaurante <reservas@tudominio.com>',
      to: email_cliente,
      subject: `Tu reserva en NOCTUA — ${codigo}`,
      html: htmlEmail,
    })

    // --- PASO 6: Respuesta exitosa ---
    return NextResponse.json(
      {
        success: true,
        codigo_reserva: codigo,
        mensaje: 'Reserva confirmada. Revisá tu email.',
      },
      { status: 201 }
    )
  } catch (err) {
    const mensaje = err instanceof Error ? err.message : 'Error interno del servidor.'
    return NextResponse.json(
      { error: `Error interno: ${mensaje}` },
      { status: 500 }
    )
  }
}

// =============================================
// DELETE /api/reservas
// =============================================
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const codigo = searchParams.get('codigo')

    if (!codigo) {
      return NextResponse.json({ error: 'Código de reserva requerido' }, { status: 400 })
    }

    const supabase = crearSupabase()

    // 1. Obtener las mesas asociadas antes de borrar
    const { data: reserva, error: fetchError } = await supabase
      .from('reservas')
      .select('mesa_id, mesas_ids')
      .eq('codigo_reserva', codigo)
      .single()

    if (fetchError || !reserva) {
      return NextResponse.json({ error: 'Reserva no encontrada' }, { status: 404 })
    }

    // 2. Borrar la reserva
    const { error: deleteError } = await supabase
      .from('reservas')
      .delete()
      .eq('codigo_reserva', codigo)

    if (deleteError) {
      return NextResponse.json({ error: 'No se pudo cancelar la reserva' }, { status: 500 })
    }

    return NextResponse.json({ success: true, mensaje: 'Reserva cancelada correctamente' })
  } catch (err) {
    return NextResponse.json({ error: 'Error al procesar la cancelación' }, { status: 500 })
  }
}
