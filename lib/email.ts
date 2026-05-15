import nodemailer from 'nodemailer'
import type Mail from 'nodemailer/lib/mailer'

/**
 * Utilidad para el envío de correos electrónicos usando Gmail SMTP + Nodemailer.
 *
 * El QR se adjunta como CID attachment (no como data URI inline), ya que
 * Gmail y la mayoría de clientes de email bloquean data: URIs por seguridad.
 *
 * Para cambiar el proveedor en el futuro:
 * 1. Modificar la configuración del 'transporter' en esta misma función.
 * 2. Actualizar las variables de entorno correspondientes.
 */
export async function sendEmail({
  to,
  subject,
  html,
  qrBuffer,
}: {
  to: string
  subject: string
  html: string
  qrBuffer?: Buffer
}) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    })

    // Adjuntos: si viene buffer del QR, lo adjuntamos con CID para que sea
    // referenciable desde el HTML con src="cid:qr-reserva"
    const attachments: Mail.Attachment[] = []
    if (qrBuffer) {
      attachments.push({
        filename: 'qr-reserva.png',
        content: qrBuffer,
        cid: 'qr-reserva', // Referenciado en el HTML como cid:qr-reserva
        contentType: 'image/png',
      })
    }

    const mailOptions: Mail.Options = {
      from: process.env.SMTP_FROM || `"NOCTUA Restaurante" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      attachments,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('✅ Email enviado correctamente:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('❌ Error al enviar email:', error)
    return { success: false, error }
  }
}
