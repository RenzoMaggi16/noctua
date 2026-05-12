'use client'

import { motion } from 'framer-motion'
import type { Mesa as MesaType, MesaEstado } from '@/types'

interface MesaProps {
  mesa: MesaType
  seleccionada: boolean
  combinada?: boolean
  onClick: (mesa: MesaType) => void
}

const CONFIG_ESTADO: Record<MesaEstado, { fondo: string; borde: string; texto: string; glow: string; label: string }> = {
  libre: {
    fondo: 'rgba(201,169,110,0.18)',
    borde: '#C9A96E',
    texto: '#C9A96E',
    glow: '0 0 14px rgba(201,169,110,0.45)',
    label: 'Libre',
  },
  ocupada: {
    fondo: 'rgba(107,30,42,0.35)',
    borde: '#6B1E2A',
    texto: 'rgba(245,240,232,0.55)',
    glow: '',
    label: 'Ocupada',
  },
  esperando_pedido: {
    fondo: 'rgba(146,64,14,0.35)',
    borde: '#D97706',
    texto: '#FCD34D',
    glow: '',
    label: 'En espera',
  },
  preparando: {
    fondo: 'rgba(146,64,14,0.35)',
    borde: '#D97706',
    texto: '#FCD34D',
    glow: '',
    label: 'Preparando',
  },
  lista_para_cobrar: {
    fondo: 'rgba(146,64,14,0.35)',
    borde: '#D97706',
    texto: '#FCD34D',
    glow: '',
    label: 'A cobrar',
  },
  cerrada: {
    fondo: 'rgba(55,65,81,0.25)',
    borde: '#374151',
    texto: '#374151',
    glow: '',
    label: 'Cerrada',
  },
}

export function Mesa({ mesa, seleccionada, combinada, onClick }: MesaProps) {
  const esLibre = mesa.estado === 'libre'
  const cfg = CONFIG_ESTADO[mesa.estado]
  const forma = mesa.forma ?? 'redonda'

  const handleClick = () => {
    if (esLibre) onClick(mesa)
  }

  // Dimensiones según forma
  const dims =
    forma === 'sofa'
      ? { width: 90, height: 52, borderRadius: 8 }
      : forma === 'cuadrada'
      ? { width: 64, height: 64, borderRadius: 6 }
      : { width: 64, height: 64, borderRadius: 999 }

  const borderStyle = combinada
    ? '2px dashed #E8C98A'
    : seleccionada
    ? '2px solid #E8C98A'
    : `2px solid ${cfg.borde}`

  const boxShadow = seleccionada
    ? '0 0 22px rgba(201,169,110,0.75), 0 0 6px rgba(232,201,138,0.4)'
    : cfg.glow || 'none'

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      disabled={!esLibre}
      whileHover={esLibre ? { scale: 1.1 } : {}}
      whileTap={esLibre ? { scale: 0.94 } : {}}
      animate={seleccionada ? { scale: 1.08 } : { scale: 1 }}
      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      style={{
        position: 'absolute',
        left: mesa.pos_x,
        top: mesa.pos_y,
        transform: 'translate(-50%, -50%)',
        width: dims.width,
        height: dims.height,
        borderRadius: dims.borderRadius,
        background: seleccionada ? 'rgba(201,169,110,0.28)' : cfg.fondo,
        border: borderStyle,
        boxShadow,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        cursor: esLibre ? 'pointer' : 'not-allowed',
        opacity: mesa.estado === 'cerrada' ? 0.45 : 1,
        touchAction: 'manipulation',
        outline: 'none',
        transition: 'background 0.2s, border 0.2s',
      }}
      aria-label={`Mesa ${mesa.numero}, ${mesa.capacidad} personas, ${cfg.label}`}
      aria-pressed={seleccionada}
    >
      {/* Número de mesa */}
      <span
        style={{
          fontSize: forma === 'sofa' ? 13 : 12,
          fontWeight: 700,
          color: seleccionada ? '#E8C98A' : cfg.texto,
          lineHeight: 1,
          fontFamily: 'inherit',
        }}
      >
        {mesa.numero}
      </span>

      {/* Capacidad */}
      <span
        style={{
          fontSize: 10,
          color: seleccionada ? 'rgba(232,201,138,0.8)' : `${cfg.texto}99`,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          lineHeight: 1,
          fontFamily: 'inherit',
        }}
      >
        <svg width="9" height="9" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
        </svg>
        {mesa.capacidad}
      </span>

      {/* Indicador sofa */}
      {forma === 'sofa' && (
        <span
          style={{
            fontSize: 8,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: seleccionada ? 'rgba(232,201,138,0.7)' : `${cfg.texto}77`,
            lineHeight: 1,
            fontFamily: 'inherit',
          }}
        >
          sofá
        </span>
      )}

      {/* Indicador seleccionada / combinada */}
      {combinada && (
        <span
          style={{
            position: 'absolute',
            top: -8,
            right: -8,
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: '#E8C98A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-hidden="true"
        >
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#0D0D0D" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </span>
      )}
    </motion.button>
  )
}
