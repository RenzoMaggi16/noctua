'use client'

import { motion, AnimatePresence } from 'framer-motion'
import type { EstadoReservaForm } from '@/types'
import { Boton } from '@/components/ui/Boton'

interface ModalConfirmacionProps {
  abierto: boolean
  estado: EstadoReservaForm
  cargando: boolean
  onConfirmar: () => void
  onCancelar: () => void
}

export function ModalConfirmacion({
  abierto,
  estado,
  cargando,
  onConfirmar,
  onCancelar,
}: ModalConfirmacionProps) {
  const { mesaSeleccionada, fecha, hora, cantidadPersonas, nombre, email } = estado

  const formatearFecha = (f: string) => {
    if (!f) return ''
    const [year, month, day] = f.split('-')
    return `${day}/${month}/${year}`
  }

  return (
    <AnimatePresence>
      {abierto && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-noctua-negro/85 backdrop-blur-sm"
            onClick={onCancelar}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-confirmacion-titulo"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="pointer-events-auto w-full max-w-md bg-noctua-oscuro border border-noctua-dorado/40 p-7"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Ícono */}
              <div className="flex justify-center mb-5">
                <div className="w-12 h-12 border border-noctua-dorado/40 flex items-center justify-center">
                  <svg className="w-6 h-6 text-noctua-dorado" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>

              <h2
                id="modal-confirmacion-titulo"
                className="font-display text-2xl text-noctua-cream text-center mb-1"
              >
                ¿Confirmar tu reserva?
              </h2>
              <p className="font-body text-noctua-cream/40 text-center text-sm mb-6">
                Revisá los detalles antes de continuar
              </p>

              {/* Detalles */}
              <div className="border border-noctua-dorado/20 divide-y divide-noctua-dorado/10 mb-6">
                {[
                  { etiqueta: 'Nombre', valor: nombre },
                  { etiqueta: 'Email', valor: email },
                  { etiqueta: 'Mesa', valor: `Mesa ${mesaSeleccionada?.numero} (hasta ${mesaSeleccionada?.capacidad} personas)` },
                  { etiqueta: 'Fecha', valor: formatearFecha(fecha) },
                  { etiqueta: 'Hora', valor: hora },
                  { etiqueta: 'Personas', valor: `${cantidadPersonas} persona${cantidadPersonas > 1 ? 's' : ''}` },
                ].map((fila) => (
                  <div key={fila.etiqueta} className="flex justify-between px-4 py-2.5">
                    <span className="font-body text-xs text-noctua-cream/40 tracking-wide uppercase">
                      {fila.etiqueta}
                    </span>
                    <span className="font-body text-sm text-noctua-cream text-right">
                      {fila.valor}
                    </span>
                  </div>
                ))}
              </div>

              {/* Acciones */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Boton
                  variante="secundario"
                  onClick={onCancelar}
                  disabled={cargando}
                  className="flex-1"
                  aria-label="Cancelar confirmación de reserva"
                >
                  Cancelar
                </Boton>
                <Boton
                  variante="primario"
                  onClick={onConfirmar}
                  cargando={cargando}
                  className="flex-1"
                  aria-label="Confirmar y crear reserva"
                >
                  Sí, confirmar
                </Boton>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
