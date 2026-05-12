'use client'

import type { ButtonHTMLAttributes } from 'react'
import { Spinner } from './Spinner'

interface BotonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: 'primario' | 'secundario' | 'fantasma'
  cargando?: boolean
  children: React.ReactNode
}

export function Boton({
  variante = 'primario',
  cargando = false,
  children,
  className = '',
  disabled,
  ...props
}: BotonProps) {
  const clases: Record<string, string> = {
    primario:
      'bg-noctua-dorado hover:bg-noctua-dorado-claro text-noctua-negro font-semibold disabled:bg-noctua-gris disabled:text-noctua-cream/40',
    secundario:
      'border border-noctua-dorado text-noctua-dorado hover:bg-noctua-dorado/10 disabled:border-noctua-gris disabled:text-noctua-gris',
    fantasma:
      'text-noctua-cream/60 hover:text-noctua-cream disabled:text-noctua-gris',
  }

  return (
    <button
      disabled={disabled || cargando}
      className={`
        relative flex items-center justify-center gap-2
        font-body text-sm tracking-widest uppercase
        px-6 py-3 transition-all duration-300
        disabled:cursor-not-allowed
        ${clases[variante]}
        ${className}
      `}
      {...props}
    >
      {cargando && <Spinner tamaño="sm" />}
      {children}
    </button>
  )
}
