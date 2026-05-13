'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Boton } from '@/components/ui/Boton'
import { ModalConfirmacion } from './ModalConfirmacion'
import type { EstadoReservaForm, ResultadoReserva } from '@/types'
import { validarFormulario, formularioEsValido, obtenerFechaHoy } from '@/lib/validaciones'
import { fadeInUp, staggerContainer } from '@/styles/animaciones'

interface FormularioReservaProps {
  estado: EstadoReservaForm
  onActualizar: <K extends keyof EstadoReservaForm>(campo: K, valor: EstadoReservaForm[K]) => void
  onDeseleccionarMesa: () => void
  onResetear: () => void
  mesasCombinadas?: string[]
}

const HORARIOS = [
  '12:00',
  '15:00',
  '18:00',
  '21:00'
]

type PanelEstado = 'formulario' | 'confirmado'

export function FormularioReserva({
  estado,
  onActualizar,
  onDeseleccionarMesa,
  onResetear,
  mesasCombinadas = [],
}: FormularioReservaProps) {
  const [panelEstado, setPanelEstado] = useState<PanelEstado>('formulario')
  const [modalAbierto, setModalAbierto] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [codigoConfirmado, setCodigoConfirmado] = useState('')
  const [errorServidor, setErrorServidor] = useState<string | null>(null)
  const [cancelando, setCancelando] = useState(false)

  const validacion = useMemo(() => validarFormulario(estado), [estado])
  const esValido = formularioEsValido(validacion)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!esValido) return
    setModalAbierto(true)
  }

  const confirmarReserva = async () => {
    setCargando(true)
    setErrorServidor(null)
    try {
      const res = await fetch('/api/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mesa_id: estado.mesaSeleccionada?.id,
          mesas_ids: mesasCombinadas.length > 0 ? mesasCombinadas : [estado.mesaSeleccionada?.id],
          mesa_numero: estado.mesaSeleccionada?.numero,
          nombre_cliente: estado.nombre.trim(),
          email_cliente: estado.email.trim(),
          telefono: estado.telefono.trim(),
          cantidad_personas: estado.cantidadPersonas,
          fecha: estado.fecha,
          hora: estado.hora,
        }),
      })

      const data: ResultadoReserva | { error: string } = await res.json()

      if (!res.ok) {
        setErrorServidor('error' in data ? data.error : 'Error inesperado. Intentá de nuevo.')
        setModalAbierto(false)
        return
      }

      if ('codigo_reserva' in data) {
        setCodigoConfirmado(data.codigo_reserva)
        setModalAbierto(false)
        setPanelEstado('confirmado')
      }
    } catch {
      setErrorServidor('Error de conexión. Verificá tu internet e intentá de nuevo.')
      setModalAbierto(false)
    } finally {
      setCargando(false)
    }
  }

  const handleOtraReserva = () => {
    onResetear()
    setPanelEstado('formulario')
    setCodigoConfirmado('')
    setErrorServidor(null)
  }

  const cancelarReserva = async () => {
    if (!codigoConfirmado) return
    
    setCancelando(true)
    try {
      const res = await fetch(`/api/reservas?codigo=${codigoConfirmado}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error('No se pudo cancelar')
      }

      // Volver al formulario tras cancelar
      handleOtraReserva()
    } catch (err) {
      alert('Error al cancelar la reserva. Por favor intenta de nuevo.')
    } finally {
      setCancelando(false)
    }
  }

  const inputClasses = (valido: boolean, tocado: boolean) =>
    `w-full bg-noctua-negro border ${
      tocado && !valido
        ? 'border-noctua-vino focus:border-noctua-vino'
        : 'border-noctua-dorado/20 focus:border-noctua-dorado'
    } text-noctua-cream font-body text-sm px-4 py-3 outline-none transition-colors placeholder:text-noctua-cream/25`

  return (
    <div className="flex flex-col h-full">
      <AnimatePresence mode="wait">
        {/* --- ESTADO: FORMULARIO --- */}
        {panelEstado === 'formulario' && (
          <motion.div
            key="formulario"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-6 flex-1"
          >
            <div>
              <h2 className="font-display text-3xl text-noctua-cream">Tu reserva</h2>
              <p className="font-body text-noctua-cream/40 text-xs mt-1">
                Completá los datos para confirmar
              </p>
            </div>

            {/* Mesa seleccionada */}
            {estado.mesaSeleccionada ? (
              <div className="border border-noctua-dorado/40 bg-noctua-dorado/5 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-noctua-dorado/20 border border-noctua-dorado flex items-center justify-center">
                    <span className="font-body text-noctua-dorado text-sm font-bold">
                      {estado.mesaSeleccionada.numero}
                    </span>
                  </div>
                  <div>
                    <p className="font-body text-noctua-cream text-sm font-medium">
                      Mesa {estado.mesaSeleccionada.numero}
                    </p>
                    <p className="font-body text-noctua-cream/40 text-xs">
                      Hasta {estado.mesaSeleccionada.capacidad} personas
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onDeseleccionarMesa}
                  className="text-noctua-cream/30 hover:text-noctua-vino transition-colors text-xs font-body"
                  aria-label="Deseleccionar mesa"
                >
                  Cambiar
                </button>
              </div>
            ) : (
              <div className="border border-noctua-dorado/10 border-dashed p-4 text-center">
                <p className="text-noctua-cream/30 text-sm font-body">
                  Seleccioná una mesa del plano
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              {/* Fecha y hora */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="fecha" className="text-xs text-noctua-dorado font-body tracking-widest uppercase">
                    Fecha
                  </label>
                  <input
                    id="fecha"
                    type="date"
                    value={estado.fecha}
                    min={obtenerFechaHoy()}
                    onChange={(e) => onActualizar('fecha', e.target.value)}
                    className={inputClasses(validacion.fecha.valido, !!estado.fecha)}
                    aria-describedby={!validacion.fecha.valido ? 'error-fecha' : undefined}
                    aria-invalid={!validacion.fecha.valido}
                  />
                  {!validacion.fecha.valido && estado.fecha && (
                    <p id="error-fecha" className="text-noctua-vino text-xs font-body" role="alert">
                      {validacion.fecha.mensaje}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="hora" className="text-xs text-noctua-dorado font-body tracking-widest uppercase">
                    Horario
                  </label>
                  <select
                    id="hora"
                    value={estado.hora}
                    onChange={(e) => onActualizar('hora', e.target.value)}
                    className={inputClasses(validacion.hora.valido, !!estado.hora)}
                    aria-describedby={!validacion.hora.valido ? 'error-hora' : undefined}
                    aria-invalid={!validacion.hora.valido}
                  >
                    <option value="">Seleccioná</option>
                    {HORARIOS.map((h) => (
                      <option key={h} value={h} className="bg-noctua-negro">
                        {h} hs
                      </option>
                    ))}
                  </select>
                  {!validacion.hora.valido && estado.hora === '' && (
                    <p id="error-hora" className="text-noctua-vino text-xs font-body" role="alert">
                      {validacion.hora.mensaje}
                    </p>
                  )}
                </div>
              </div>

              {/* Personas */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="personas" className="text-xs text-noctua-dorado font-body tracking-widest uppercase">
                  Cantidad de personas
                </label>
                <input
                  id="personas"
                  type="number"
                  min={1}
                  max={estado.mesaSeleccionada?.capacidad ?? 20}
                  value={estado.cantidadPersonas}
                  onChange={(e) => onActualizar('cantidadPersonas', parseInt(e.target.value, 10) || 1)}
                  className={inputClasses(validacion.cantidadPersonas.valido, estado.cantidadPersonas > 0)}
                  placeholder="Ej: 2"
                  aria-describedby={!validacion.cantidadPersonas.valido ? 'error-personas' : undefined}
                  aria-invalid={!validacion.cantidadPersonas.valido}
                />
                {!validacion.cantidadPersonas.valido && (
                  <p id="error-personas" className="text-noctua-vino text-xs font-body" role="alert">
                    {validacion.cantidadPersonas.mensaje}
                  </p>
                )}
              </div>

              {/* Nombre */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="nombre" className="text-xs text-noctua-dorado font-body tracking-widest uppercase">
                  Nombre completo
                </label>
                <input
                  id="nombre"
                  type="text"
                  value={estado.nombre}
                  onChange={(e) => onActualizar('nombre', e.target.value)}
                  className={inputClasses(validacion.nombre.valido, estado.nombre.length > 0)}
                  placeholder="Tu nombre completo"
                  autoComplete="name"
                  aria-describedby={!validacion.nombre.valido ? 'error-nombre' : undefined}
                  aria-invalid={!validacion.nombre.valido}
                />
                {!validacion.nombre.valido && estado.nombre.length > 0 && (
                  <p id="error-nombre" className="text-noctua-vino text-xs font-body" role="alert">
                    {validacion.nombre.mensaje}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-xs text-noctua-dorado font-body tracking-widest uppercase">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={estado.email}
                  onChange={(e) => onActualizar('email', e.target.value)}
                  className={inputClasses(validacion.email.valido, estado.email.length > 0)}
                  placeholder="tu@email.com"
                  autoComplete="email"
                  aria-describedby={!validacion.email.valido ? 'error-email' : undefined}
                  aria-invalid={!validacion.email.valido}
                />
                {!validacion.email.valido && estado.email.length > 0 && (
                  <p id="error-email" className="text-noctua-vino text-xs font-body" role="alert">
                    {validacion.email.mensaje}
                  </p>
                )}
              </div>

              {/* Teléfono */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="telefono" className="text-xs text-noctua-dorado font-body tracking-widest uppercase">
                  Teléfono
                </label>
                <input
                  id="telefono"
                  type="tel"
                  value={estado.telefono}
                  onChange={(e) => onActualizar('telefono', e.target.value)}
                  className={inputClasses(validacion.telefono.valido, estado.telefono.length > 0)}
                  placeholder="+54 11 XXXX-XXXX"
                  autoComplete="tel"
                  aria-describedby={!validacion.telefono.valido ? 'error-telefono' : undefined}
                  aria-invalid={!validacion.telefono.valido}
                />
                {!validacion.telefono.valido && estado.telefono.length > 0 && (
                  <p id="error-telefono" className="text-noctua-vino text-xs font-body" role="alert">
                    {validacion.telefono.mensaje}
                  </p>
                )}
              </div>

              {/* Error servidor */}
              {errorServidor && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-noctua-vino/50 bg-noctua-vino/10 p-3"
                  role="alert"
                >
                  <p className="text-noctua-cream/80 text-sm font-body">{errorServidor}</p>
                </motion.div>
              )}

              {/* Botón submit */}
              <Boton
                type="submit"
                variante="primario"
                disabled={!esValido}
                className="w-full mt-2"
                aria-label="Revisar y confirmar reserva"
              >
                Confirmar Reserva
              </Boton>
            </form>
          </motion.div>
        )}

        {/* --- ESTADO: CONFIRMADO --- */}
        {panelEstado === 'confirmado' && (
          <motion.div
            key="confirmado"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
            className="flex flex-col items-center text-center gap-6 flex-1 justify-center py-8"
          >
            {/* Ícono checkmark animado */}
            <motion.div
              variants={fadeInUp}
              className="w-20 h-20 rounded-full border-2 border-noctua-dorado flex items-center justify-center animate-glow"
            >
              <motion.svg
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="w-10 h-10 text-noctua-dorado"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <motion.path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M5 13l4 4L19 7"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                />
              </motion.svg>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex flex-col gap-2">
              <h2 className="font-display text-4xl text-noctua-cream">¡Reserva Confirmada!</h2>
              <p className="font-body text-noctua-cream/50 text-sm">
                Tu lugar en NOCTUA está reservado
              </p>
            </motion.div>

            {/* Código */}
            <motion.div
              variants={fadeInUp}
              className="border border-noctua-dorado/40 bg-noctua-dorado/5 px-8 py-4"
            >
              <p className="text-noctua-cream/40 text-xs font-body tracking-widest uppercase mb-2">
                Código de reserva
              </p>
              <p className="font-mono text-2xl text-noctua-dorado tracking-widest font-semibold">
                {codigoConfirmado}
              </p>
            </motion.div>

            {/* Detalles */}
            <motion.div variants={fadeInUp} className="w-full border border-noctua-dorado/10 divide-y divide-noctua-dorado/10">
              {[
                { etiqueta: 'Mesa', valor: `Mesa ${estado.mesaSeleccionada?.numero}` },
                { etiqueta: 'Fecha', valor: estado.fecha ? new Date(estado.fecha + 'T12:00').toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '' },
                { etiqueta: 'Hora', valor: `${estado.hora} hs` },
                { etiqueta: 'Personas', valor: `${estado.cantidadPersonas}` },
              ].map((fila) => (
                <div key={fila.etiqueta} className="flex justify-between px-4 py-2.5">
                  <span className="font-body text-xs text-noctua-cream/40 tracking-wide uppercase">
                    {fila.etiqueta}
                  </span>
                  <span className="font-body text-sm text-noctua-cream">{fila.valor}</span>
                </div>
              ))}
            </motion.div>

            <motion.p variants={fadeInUp} className="text-noctua-cream/40 text-xs font-body flex items-center gap-2">
              <svg className="w-4 h-4 text-noctua-dorado/60" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Te enviamos el QR a tu email
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col gap-3 mt-auto pt-6">
              <Boton 
                variante="primario" 
                onClick={handleOtraReserva}
                className="w-full"
                aria-label="Hacer otra reserva"
              >
                Hacer otra reserva
              </Boton>
              
              <button
                onClick={cancelarReserva}
                disabled={cancelando}
                className="text-noctua-vino hover:text-noctua-vino/80 text-xs font-body tracking-widest uppercase py-2 transition-colors disabled:opacity-50"
              >
                {cancelando ? 'Cancelando...' : 'Cancelar esta reserva'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal confirmación antes de enviar */}
      <ModalConfirmacion
        abierto={modalAbierto}
        estado={estado}
        cargando={cargando}
        onConfirmar={confirmarReserva}
        onCancelar={() => setModalAbierto(false)}
      />
    </div>
  )
}
