'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MapaRestaurante } from '@/components/mapa/MapaRestaurante'
import { FormularioReserva } from '@/components/reservas/FormularioReserva'
import { useReserva } from '@/hooks/useReserva'

export default function ReservasPage() {
  const { estado, seleccionarMesa, deseleccionarMesa, actualizarCampo, resetear } = useReserva()
  const [mesasCombinadas, setMesasCombinadas] = useState<string[]>([])

  const handleDeseleccionar = () => {
    deseleccionarMesa()
    setMesasCombinadas([])
  }

  return (
    <div className="min-h-screen bg-noctua-negro pt-16">
      {/* Subheader */}
      <div className="border-b border-noctua-dorado/10 bg-noctua-oscuro">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl text-noctua-cream">
              Reservar <em className="text-noctua-dorado">Mesa</em>
            </h1>
            <p className="font-body text-noctua-cream/40 text-xs mt-0.5">
              Seleccioná tu mesa en el plano y completá los datos
            </p>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 text-noctua-cream/40 hover:text-noctua-dorado transition-colors text-sm font-body"
            aria-label="Volver al inicio"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al inicio
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Mapa — 60% */}
          <div className="lg:col-span-3 min-h-[560px]">
            <MapaRestaurante
              mesaSeleccionadaId={estado.mesaSeleccionada?.id ?? null}
              onSeleccionarMesa={seleccionarMesa}
              mesasCombinadas={mesasCombinadas}
              onCambiarCombinadas={setMesasCombinadas}
            />
          </div>

          {/* Panel formulario — 40% */}
          <div className="lg:col-span-2">
            <div className="bg-noctua-oscuro border border-noctua-dorado/10 p-6 lg:p-8 lg:sticky lg:top-24">
              <FormularioReserva
                estado={estado}
                onActualizar={actualizarCampo}
                onDeseleccionarMesa={handleDeseleccionar}
                onResetear={resetear}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
