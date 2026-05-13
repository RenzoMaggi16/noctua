import nodemailer from 'nodemailer'

/**
 * Utilidad para el envío de correos electrónicos utilizando Gmail SMTP + Nodemailer.
 * 
 * Para cambiar el proveedor en el futuro:
 * 1. Modificar la configuración del 'transporter' en esta misma función.
 * 2. Actualizar las variables de entorno correspondientes.
 */
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) {
  try {
    // Configuración del transporter para Gmail
    // Se recomienda usar una "App Password" de Google, no la contraseña normal.
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    const mailOptions = {
      from: `"NOCTUA Restaurante" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Email enviado correctamente:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Error al enviar email:', error)
    // Retornamos success: false pero no lanzamos el error para no bloquear el flujo principal
    return { success: false, error }
  }
}
