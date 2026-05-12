import type { Mesa, EstadoReservaForm } from '@/types'

interface PanelResumenProps {
  mesa: Mesa
  datos: Pick<EstadoReservaForm, 'fecha' | 'hora' | 'cantidadPersonas' | 'nombre'>
}

export function PanelResumen({ mesa, datos }: PanelResumenProps) {
  const formatearFecha = (f: string) => {
    if (!f) return '—'
    const [year, month, day] = f.split('-')
    return `${day}/${month}/${year}`
  }

  return (
    <div className="border border-noctua-dorado/20 bg-noctua-dorado/5 p-4 flex flex-col gap-3">
      <h3 className="font-display text-lg text-noctua-dorado">Resumen de reserva</h3>
      <div className="divide-y divide-noctua-dorado/10">
        {[
          { etiqueta: 'Mesa', valor: `Mesa ${mesa.numero}` },
          { etiqueta: 'Planta', valor: mesa.piso === 'baja' ? 'Planta Baja' : 'Planta Alta' },
          { etiqueta: 'Capacidad', valor: `${mesa.capacidad} personas` },
          { etiqueta: 'Fecha', valor: formatearFecha(datos.fecha) },
          { etiqueta: 'Hora', valor: datos.hora ? `${datos.hora} hs` : '—' },
          { etiqueta: 'Personas', valor: datos.cantidadPersonas ? `${datos.cantidadPersonas}` : '—' },
          { etiqueta: 'Nombre', valor: datos.nombre || '—' },
        ].map((fila) => (
          <div key={fila.etiqueta} className="flex justify-between py-2">
            <span className="font-body text-xs text-noctua-cream/40 tracking-wide uppercase">
              {fila.etiqueta}
            </span>
            <span className="font-body text-sm text-noctua-cream">{fila.valor}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
