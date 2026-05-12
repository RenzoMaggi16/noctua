// =============================================
// NOCTUA — Definiciones de tipos TypeScript
// =============================================

export type MesaEstado =
  | 'libre'
  | 'ocupada'
  | 'esperando_pedido'
  | 'preparando'
  | 'lista_para_cobrar'
  | 'cerrada'

export type PisoType = 'baja' | 'alta'

export type ZonaMesa = 'terraza' | 'salon' | 'sofas' | 'bar' | 'cocina' | 'balcon' | 'vip' | 'lounge'

export type FormaMesa = 'redonda' | 'cuadrada' | 'sofa'

export interface Mesa {
  id: string
  numero: number
  capacidad: number
  pos_x: number
  pos_y: number
  estado: MesaEstado
  piso: PisoType
  zona?: ZonaMesa
  forma?: FormaMesa
}

export interface Reserva {
  id: string
  mesa_id: string
  nombre_cliente: string
  email_cliente: string
  telefono: string
  cantidad_personas: number
  fecha: string
  hora: string
  codigo_reserva: string
  creada_en: string
}

export interface EstadoReservaForm {
  mesaSeleccionada: Mesa | null
  fecha: string
  hora: string
  cantidadPersonas: number
  nombre: string
  email: string
  telefono: string
}

export interface DatosQR {
  codigo: string
  nombre: string
  mesa: number
  fecha: string
  hora: string
  personas: number
  restaurante: string
}

export interface ResultadoReserva {
  success: boolean
  codigo_reserva: string
  mensaje: string
}

export interface ErrorReserva {
  error: string
}

export interface CampoValidacion {
  valido: boolean
  mensaje: string
}

export interface ValidacionFormulario {
  mesa: CampoValidacion
  fecha: CampoValidacion
  hora: CampoValidacion
  cantidadPersonas: CampoValidacion
  nombre: CampoValidacion
  email: CampoValidacion
  telefono: CampoValidacion
}
