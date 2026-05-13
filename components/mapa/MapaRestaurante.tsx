'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMesas } from '@/hooks/useMesas'
import { Mesa } from './Mesa'
import { SelectorPiso } from './SelectorPiso'
import { LeyendaMesas } from './LeyendaMesas'
import { Spinner } from '@/components/ui/Spinner'
import type { Mesa as MesaType, PisoType } from '@/types'

interface MapaRestauranteProps {
  mesaSeleccionadaId: string | null
  onSeleccionarMesa: (mesa: MesaType) => void
  mesasCombinadas?: string[]
  onCambiarCombinadas?: (ids: string[]) => void
  fecha?: string
  hora?: string
}

// Dimensiones fijas del "lienzo" del plano
const MAP_W = 640
const MAP_H = 500

/* --- Zonas del restaurante ----------------------------------- */
const ZONAS_BAJA = [
  { id: 'terraza',  label: '☀  Terraza exterior', x: 16,  y: 16,  w: 390, h: 110, border: 'rgba(201,169,110,0.22)', bg: 'rgba(201,169,110,0.04)' },
  { id: 'salon',    label: '✦  Salón principal',  x: 16,  y: 142, w: 390, h: 200, border: 'rgba(245,240,232,0.08)', bg: 'rgba(245,240,232,0.02)' },
  { id: 'sofas',    label: '⬡  Zona Sofás',       x: 422, y: 120, w: 202, h: 222, border: 'rgba(107,30,42,0.25)',  bg: 'rgba(107,30,42,0.07)'  },
  { id: 'bar',      label: '◈  Bar',              x: 16,  y: 358, w: 298, h: 126, border: 'rgba(107,30,42,0.20)',  bg: 'rgba(107,30,42,0.05)'  },
  { id: 'cocina',   label: '◈  Zona Cocina',      x: 326, y: 358, w: 298, h: 126, border: 'rgba(55,65,81,0.22)',   bg: 'rgba(55,65,81,0.07)'   },
]

const ZONAS_ALTA = [
  { id: 'balcon',  label: '⌂  Balcón / Vista',    x: 16,  y: 16,  w: 390, h: 110, border: 'rgba(201,169,110,0.22)', bg: 'rgba(201,169,110,0.05)' },
  { id: 'salon',   label: '✦  Salón principal',   x: 16,  y: 142, w: 390, h: 210, border: 'rgba(245,240,232,0.08)', bg: 'rgba(245,240,232,0.02)' },
  { id: 'vip',     label: '★  Sala VIP / Privada', x: 422, y: 142, w: 202, h: 210, border: 'rgba(201,169,110,0.30)', bg: 'rgba(201,169,110,0.05)' },
  { id: 'lounge',  label: '◈  Lounge',            x: 16,  y: 368, w: 390, h: 116, border: 'rgba(107,30,42,0.20)',  bg: 'rgba(107,30,42,0.06)'  },
]

/* --- Etiquetas de referencia ---------------------------------- */
const REFS_BAJA = [
  { label: 'Entrada principal', x: 320, y: 492 },
  { label: '← Cocina',         x: 620, y: 421 },
  { label: '→ Baños',          x: 28,  y: 421 },
]
const REFS_ALTA = [
  { label: '↑ Escalera',     x: 320, y: 492 },
  { label: '← Sala Privada', x: 618, y: 210 },
]

export function MapaRestaurante({
  mesaSeleccionadaId,
  onSeleccionarMesa,
  mesasCombinadas = [],
  onCambiarCombinadas,
  fecha,
  hora,
}: MapaRestauranteProps) {
  const [pisoActivo, setPisoActivo] = useState<PisoType>('baja')
  
  // Fuente de verdad única: El hook useMesas que consulta Supabase
  // Ahora pasamos fecha y hora para filtrar disponibilidad en tiempo real
  const { mesas, cargando, error } = useMesas(pisoActivo, fecha, hora)

  const [modoUnir, setModoUnir] = useState(false)
  const [selUnir, setSelUnir] = useState<string[]>([])

  const zonas = useMemo(() => pisoActivo === 'baja' ? ZONAS_BAJA : ZONAS_ALTA, [pisoActivo])
  const refs  = useMemo(() => pisoActivo === 'baja' ? REFS_BAJA  : REFS_ALTA, [pisoActivo])

  /* --- Scale-to-fit usando ResizeObserver ----------------------- */
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    if (!wrapperRef.current) return
    const obs = new ResizeObserver(([entry]) => {
      const availableW = entry.contentRect.width
      // Calculamos la escala para que el mapa quepa en el ancho disponible
      // Restamos un pequeño margen para el borde
      const newScale = availableW < MAP_W ? (availableW - 2) / MAP_W : 1
      setScale(newScale)
    })
    obs.observe(wrapperRef.current)
    return () => obs.disconnect()
  }, [])

  /* --- Selección de mesas --------------------------------------- */
  const handleMesaClick = (mesa: MesaType) => {
    if (modoUnir) {
      setSelUnir((prev) =>
        prev.includes(mesa.id) ? prev.filter((id) => id !== mesa.id) : [...prev, mesa.id]
      )
      return
    }
    onSeleccionarMesa(mesa)
  }

  const confirmarUnion = () => {
    if (selUnir.length >= 2) {
      const mesasComb = mesas.filter((m) => selUnir.includes(m.id))
      const capacidadTotal = mesasComb.reduce((acc, m) => acc + m.capacidad, 0)
      const mesaPrincipal: MesaType = { ...mesasComb[0], capacidad: capacidadTotal }
      onCambiarCombinadas?.(selUnir)
      onSeleccionarMesa(mesaPrincipal)
    }
    setModoUnir(false)
    setSelUnir([])
  }

  const cancelarUnion = () => {
    setModoUnir(false)
    setSelUnir([])
  }

  const combinadasActivas = useMemo(() => mesasCombinadas, [mesasCombinadas])
  const mesasLibres = mesas.filter((m) => m.estado === 'libre').length

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* --- Header ------------------------------------------------ */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="font-display text-2xl text-noctua-cream">Seleccioná tu mesa</h2>
            <p className="font-body text-noctua-cream/40 text-xs mt-1">
              {modoUnir
                ? `Seleccioná ${selUnir.length === 0 ? 'las mesas' : `${selUnir.length} mesa${selUnir.length > 1 ? 's' : ''}`} a unir`
                : 'Las mesas doradas están disponibles'}
            </p>
          </div>
          <SelectorPiso pisoActivo={pisoActivo} onChange={setPisoActivo} />
        </div>

        <div className="flex items-center justify-between flex-wrap gap-2">
          <LeyendaMesas />

          {!modoUnir ? (
            <button
              type="button"
              onClick={() => setModoUnir(true)}
              className="flex items-center gap-1.5 text-xs font-body text-noctua-dorado/60 hover:text-noctua-dorado border border-noctua-dorado/20 hover:border-noctua-dorado/50 px-3 py-1.5 transition-all whitespace-nowrap"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              Unir mesas
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={cancelarUnion}
                className="text-xs font-body text-noctua-cream/40 hover:text-noctua-cream border border-noctua-cream/10 px-3 py-1.5 transition-all"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmarUnion}
                disabled={selUnir.length < 2}
                className="text-xs font-body bg-noctua-dorado/90 hover:bg-noctua-dorado text-noctua-negro font-semibold px-3 py-1.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Confirmar unión ({selUnir.length})
              </button>
            </div>
          )}
        </div>
      </div>

      {/* --- Contenedor del mapa ------------------------------------ */}
      <div
        ref={wrapperRef}
        className="relative bg-noctua-negro border border-noctua-dorado/10 overflow-hidden"
        style={{ height: Math.ceil(MAP_H * scale) + 2 }}
      >
        {/* Grid decorativo */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(201,169,110,0.7) 1px, transparent 1px),
              linear-gradient(90deg, rgba(201,169,110,0.7) 1px, transparent 1px)
            `,
            backgroundSize: `${40 * scale}px ${40 * scale}px`,
          }}
        />

        {/* Spinner de carga */}
        {cargando && (
          <div className="absolute inset-0 flex items-center justify-center bg-noctua-negro/70 z-20">
            <div className="flex flex-col items-center gap-3">
              <Spinner tamaño="lg" />
              <span className="text-noctua-cream/50 text-xs font-body">Cargando plano...</span>
            </div>
          </div>
        )}

        {/* Canvas escalado */}
        <AnimatePresence mode="wait">
          {error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center p-6 text-center"
            >
              <div className="flex flex-col items-center gap-3">
                <p className="text-noctua-vino text-sm font-body">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="text-noctua-dorado text-xs underline font-body"
                >
                  Reintentar conexión
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={pisoActivo}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="absolute inset-0 origin-top-left"
              style={{
                width: MAP_W,
                height: MAP_H,
                transform: `scale(${scale})`,
              }}
            >
              {/* Borde interior */}
              <div
                style={{
                  position: 'absolute',
                  inset: 8,
                  border: '1px solid rgba(201,169,110,0.12)',
                  borderRadius: 3,
                  pointerEvents: 'none',
                }}
              />

            {/* Zonas */}
            {zonas.map((z) => (
              <div
                key={z.id}
                style={{
                  position: 'absolute',
                  left: z.x, top: z.y,
                  width: z.w, height: z.h,
                  background: z.bg,
                  border: `1px solid ${z.border}`,
                  borderRadius: 4,
                  pointerEvents: 'none',
                }}
              >
                <span style={{
                  position: 'absolute',
                  top: 5, left: 8,
                  fontSize: 8,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'rgba(201,169,110,0.42)',
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                }}>
                  {z.label}
                </span>
              </div>
            ))}

            {/* Etiquetas de referencia */}
            {refs.map((r) => (
              <div
                key={r.label}
                style={{
                  position: 'absolute',
                  left: r.x, top: r.y,
                  transform: 'translate(-50%, -50%)',
                  pointerEvents: 'none',
                }}
              >
                <span style={{
                  fontSize: 8,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'rgba(245,240,232,0.18)',
                  whiteSpace: 'nowrap',
                }}>
                  {r.label}
                </span>
              </div>
            ))}

            {/* Mesas */}
            {mesas.map((mesa) => (
              <Mesa
                key={mesa.id}
                mesa={mesa}
                seleccionada={
                  modoUnir ? selUnir.includes(mesa.id) : mesaSeleccionadaId === mesa.id
                }
                combinada={combinadasActivas.includes(mesa.id)}
                onClick={handleMesaClick}
              />
            ))}

            {/* Modo unir: overlay oscuro */}
            {modoUnir && (
              <div
                style={{
                  position: 'absolute', inset: 0, zIndex: 1,
                  background: 'radial-gradient(ellipse at center, transparent 55%, rgba(13,13,13,0.45) 100%)',
                  pointerEvents: 'none',
                }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>

      {/* --- Pie --------------------------------------------------- */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${mesasLibres > 0 ? 'bg-green-500 animate-pulse' : 'bg-noctua-vino'}`} />
          <span className="text-noctua-cream/30 text-xs font-body tracking-wide">
            {mesasLibres} mesas disponibles
          </span>
        </div>
        <span className="text-noctua-cream/20 text-[10px] font-body tracking-widest uppercase">
          {pisoActivo === 'baja' ? 'Planta Baja' : 'Planta Alta'}
        </span>
      </div>
    </div>
  )
}
