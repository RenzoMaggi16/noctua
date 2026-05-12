'use client'

import type { PisoType } from '@/types'

interface SelectorPisoProps {
  pisoActivo: PisoType
  onChange: (piso: PisoType) => void
}

const PISOS: { valor: PisoType; etiqueta: string }[] = [
  { valor: 'baja', etiqueta: 'Planta Baja' },
  { valor: 'alta', etiqueta: 'Planta Alta' },
]

export function SelectorPiso({ pisoActivo, onChange }: SelectorPisoProps) {
  return (
    <div
      className="flex gap-1 p-1 bg-noctua-negro/50 border border-noctua-dorado/20"
      role="group"
      aria-label="Seleccionar piso del restaurante"
    >
      {PISOS.map((piso) => {
        const activo = pisoActivo === piso.valor
        return (
          <button
            key={piso.valor}
            type="button"
            onClick={() => onChange(piso.valor)}
            className={`
              flex-1 py-2 px-4 text-xs font-body tracking-widest uppercase
              transition-all duration-300 font-medium
              ${
                activo
                  ? 'bg-noctua-dorado text-noctua-negro'
                  : 'bg-transparent text-noctua-dorado border border-noctua-dorado/40 hover:border-noctua-dorado hover:bg-noctua-dorado/10'
              }
            `}
            aria-pressed={activo}
            aria-label={`Ver ${piso.etiqueta}`}
          >
            {piso.etiqueta}
          </button>
        )
      })}
    </div>
  )
}
