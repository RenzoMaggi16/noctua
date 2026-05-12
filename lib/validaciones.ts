import type { EstadoReservaForm, CampoValidacion, ValidacionFormulario } from '@/types'

// ================================================
// NOCTUA — Validaciones del Formulario de Reserva
// ================================================

export function validarEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

export function validarTelefono(telefono: string): boolean {
  const soloDigitos = telefono.replace(/[\s\-+()]/g, '')
  return soloDigitos.length >= 8
}

export function obtenerFechaHoy(): string {
  const hoy = new Date()
  return hoy.toISOString().split('T')[0]
}

export function validarFecha(fecha: string): boolean {
  if (!fecha) return false
  const hoy = obtenerFechaHoy()
  return fecha >= hoy
}

export function validarFormulario(estado: EstadoReservaForm): ValidacionFormulario {
  const mesaCapacidad = estado.mesaSeleccionada?.capacidad ?? 0

  const mesa: CampoValidacion = estado.mesaSeleccionada
    ? { valido: true, mensaje: '' }
    : { valido: false, mensaje: 'Seleccioná una mesa del plano' }

  const fecha: CampoValidacion = validarFecha(estado.fecha)
    ? { valido: true, mensaje: '' }
    : {
        valido: false,
        mensaje: estado.fecha
          ? 'La fecha no puede ser anterior a hoy'
          : 'Seleccioná una fecha',
      }

  const hora: CampoValidacion = estado.hora
    ? { valido: true, mensaje: '' }
    : { valido: false, mensaje: 'Seleccioná un horario' }

  const cantidadPersonas: CampoValidacion =
    estado.cantidadPersonas >= 1 && estado.cantidadPersonas <= mesaCapacidad
      ? { valido: true, mensaje: '' }
      : {
          valido: false,
          mensaje:
            estado.cantidadPersonas < 1
              ? 'Ingresá al menos 1 persona'
              : `Máximo ${mesaCapacidad} personas para esta mesa`,
        }

  const nombre: CampoValidacion =
    estado.nombre.trim().length >= 3
      ? { valido: true, mensaje: '' }
      : {
          valido: false,
          mensaje:
            estado.nombre.trim().length === 0
              ? 'Ingresá tu nombre completo'
              : 'El nombre debe tener al menos 3 caracteres',
        }

  const email: CampoValidacion = validarEmail(estado.email)
    ? { valido: true, mensaje: '' }
    : {
        valido: false,
        mensaje: estado.email ? 'El email no es válido' : 'Ingresá tu email',
      }

  const telefono: CampoValidacion = validarTelefono(estado.telefono)
    ? { valido: true, mensaje: '' }
    : {
        valido: false,
        mensaje: estado.telefono
          ? 'El teléfono debe tener al menos 8 dígitos'
          : 'Ingresá tu teléfono',
      }

  return { mesa, fecha, hora, cantidadPersonas, nombre, email, telefono }
}

export function formularioEsValido(validacion: ValidacionFormulario): boolean {
  return Object.values(validacion).every((campo) => campo.valido)
}
