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
}

// Dimensiones fijas del "lienzo" del plano
const MAP_W = 640
const MAP_H = 500

/* ─── Zonas del restaurante ─────────────────────────────────── */
const ZONAS_BAJA = [
  { id: 'terraza',  label: '☀  Terraza exterior', x: 16,  y: 16,  w: 388, h: 108, border: 'rgba(201,169,110,0.22)', bg: 'rgba(201,169,110,0.04)' },
  { id: 'salon',    label: '✦  Salón principal',  x: 16,  y: 140, w: 388, h: 200, border: 'rgba(245,240,232,0.08)', bg: 'rgba(245,240,232,0.02)' },
  { id: 'sofas',    label: '⬡  Zona Sofás',       x: 420, y: 120, w: 204, h: 224, border: 'rgba(107,30,42,0.25)',  bg: 'rgba(107,30,42,0.07)'  },
  { id: 'bar',      label: '◈  Bar',              x: 16,  y: 356, w: 296, h: 128, border: 'rgba(107,30,42,0.20)',  bg: 'rgba(107,30,42,0.05)'  },
  { id: 'cocina',   label: '◈  Zona Cocina',      x: 328, y: 356, w: 296, h: 128, border: 'rgba(55,65,81,0.22)',   bg: 'rgba(55,65,81,0.07)'   },
]

const ZONAS_ALTA = [
  { id: 'balcon',  label: '⌂  Balcón / Vista',    x: 16,  y: 16,  w: 388, h: 108, border: 'rgba(201,169,110,0.22)', bg: 'rgba(201,169,110,0.05)' },
  { id: 'salon',   label: '✦  Salón principal',   x: 16,  y: 140, w: 388, h: 210, border: 'rgba(245,240,232,0.08)', bg: 'rgba(245,240,232,0.02)' },
  { id: 'vip',     label: '★  Sala VIP / Privada', x: 420, y: 140, w: 204, h: 210, border: 'rgba(201,169,110,0.30)', bg: 'rgba(201,169,110,0.05)' },
  { id: 'lounge',  label: '◈  Lounge',            x: 16,  y: 366, w: 388, h: 118, border: 'rgba(107,30,42,0.20)',  bg: 'rgba(107,30,42,0.06)'  },
]

/* ─── Etiquetas de referencia ────────────────────────────────── */
const REFS_BAJA = [
  { label: 'Entrada principal', x: 280, y: 492 },
  { label: '← Cocina',         x: 620, y: 418 },
  { label: '→ Baños',          x: 28,  y: 418 },
]
const REFS_ALTA = [
  { label: '↑ Escalera',     x: 280, y: 492 },
  { label: '← Sala Privada', x: 618, y: 210 },
]

/* ─── Posiciones de mesas ────────────────────────────────────── */
const MESAS_BAJA: MesaType[] = [
  // Terraza
  { id: 'pb-t1', numero: 1,  capacidad: 2, pos_x: 80,  pos_y: 68,  estado: 'libre',             piso: 'baja', zona: 'terraza', forma: 'redonda'  },
  { id: 'pb-t2', numero: 2,  capacidad: 2, pos_x: 158, pos_y: 68,  estado: 'ocupada',            piso: 'baja', zona: 'terraza', forma: 'redonda'  },
  { id: 'pb-t3', numero: 3,  capacidad: 4, pos_x: 248, pos_y: 68,  estado: 'libre',             piso: 'baja', zona: 'terraza', forma: 'redonda'  },
  { id: 'pb-t4', numero: 4,  capacidad: 2, pos_x: 334, pos_y: 68,  estado: 'libre',             piso: 'baja', zona: 'terraza', forma: 'redonda'  },
  // Salón principal
  { id: 'pb-p1', numero: 5,  capacidad: 4, pos_x: 78,  pos_y: 212, estado: 'libre',             piso: 'baja', zona: 'salon',   forma: 'cuadrada' },
  { id: 'pb-p2', numero: 6,  capacidad: 4, pos_x: 178, pos_y: 212, estado: 'ocupada',            piso: 'baja', zona: 'salon',   forma: 'cuadrada' },
  { id: 'pb-p3', numero: 7,  capacidad: 6, pos_x: 286, pos_y: 212, estado: 'libre',             piso: 'baja', zona: 'salon',   forma: 'cuadrada' },
  { id: 'pb-p4', numero: 8,  capacidad: 4, pos_x: 78,  pos_y: 302, estado: 'esperando_pedido',  piso: 'baja', zona: 'salon',   forma: 'cuadrada' },
  { id: 'pb-p5', numero: 9,  capacidad: 4, pos_x: 178, pos_y: 302, estado: 'libre',             piso: 'baja', zona: 'salon',   forma: 'cuadrada' },
  { id: 'pb-p6', numero: 10, capacidad: 6, pos_x: 286, pos_y: 302, estado: 'libre',             piso: 'baja', zona: 'salon',   forma: 'cuadrada' },
  // Sofás
  { id: 'pb-s1', numero: 11, capacidad: 6, pos_x: 522, pos_y: 192, estado: 'libre',             piso: 'baja', zona: 'sofas',   forma: 'sofa'     },
  { id: 'pb-s2', numero: 12, capacidad: 8, pos_x: 522, pos_y: 298, estado: 'ocupada',            piso: 'baja', zona: 'sofas',   forma: 'sofa'     },
  // Bar
  { id: 'pb-b1', numero: 13, capacidad: 2, pos_x: 72,  pos_y: 418, estado: 'libre',             piso: 'baja', zona: 'bar',     forma: 'redonda'  },
  { id: 'pb-b2', numero: 14, capacidad: 2, pos_x: 148, pos_y: 418, estado: 'libre',             piso: 'baja', zona: 'bar',     forma: 'redonda'  },
  { id: 'pb-b3', numero: 15, capacidad: 2, pos_x: 228, pos_y: 418, estado: 'ocupada',            piso: 'baja', zona: 'bar',     forma: 'redonda'  },
  // Cocina
  { id: 'pb-c1', numero: 16, capacidad: 4, pos_x: 402, pos_y: 418, estado: 'libre',             piso: 'baja', zona: 'cocina',  forma: 'cuadrada' },
  { id: 'pb-c2', numero: 17, capacidad: 4, pos_x: 484, pos_y: 418, estado: 'cerrada',            piso: 'baja', zona: 'cocina',  forma: 'cuadrada' },
  { id: 'pb-c3', numero: 18, capacidad: 4, pos_x: 566, pos_y: 418, estado: 'libre',             piso: 'baja', zona: 'cocina',  forma: 'cuadrada' },
]

const MESAS_ALTA: MesaType[] = [
  // Balcón
  { id: 'pa-v1', numero: 19, capacidad: 2, pos_x: 80,  pos_y: 68,  estado: 'libre',            piso: 'alta', zona: 'balcon',  forma: 'redonda'  },
  { id: 'pa-v2', numero: 20, capacidad: 2, pos_x: 160, pos_y: 68,  estado: 'libre',            piso: 'alta', zona: 'balcon',  forma: 'redonda'  },
  { id: 'pa-v3', numero: 21, capacidad: 4, pos_x: 252, pos_y: 68,  estado: 'ocupada',           piso: 'alta', zona: 'balcon',  forma: 'redonda'  },
  { id: 'pa-v4', numero: 22, capacidad: 4, pos_x: 340, pos_y: 68,  estado: 'libre',            piso: 'alta', zona: 'balcon',  forma: 'redonda'  },
  // Salón
  { id: 'pa-p1', numero: 23, capacidad: 4, pos_x: 80,  pos_y: 210, estado: 'libre',            piso: 'alta', zona: 'salon',   forma: 'cuadrada' },
  { id: 'pa-p2', numero: 24, capacidad: 4, pos_x: 178, pos_y: 210, estado: 'ocupada',           piso: 'alta', zona: 'salon',   forma: 'cuadrada' },
  { id: 'pa-p3', numero: 25, capacidad: 6, pos_x: 286, pos_y: 210, estado: 'libre',            piso: 'alta', zona: 'salon',   forma: 'cuadrada' },
  { id: 'pa-p4', numero: 26, capacidad: 6, pos_x: 80,  pos_y: 310, estado: 'libre',            piso: 'alta', zona: 'salon',   forma: 'cuadrada' },
  { id: 'pa-p5', numero: 27, capacidad: 4, pos_x: 178, pos_y: 310, estado: 'esperando_pedido', piso: 'alta', zona: 'salon',   forma: 'cuadrada' },
  // VIP
  { id: 'pa-vip1', numero: 28, capacidad: 8,  pos_x: 522, pos_y: 210, estado: 'libre',         piso: 'alta', zona: 'vip',     forma: 'sofa'     },
  { id: 'pa-vip2', numero: 29, capacidad: 10, pos_x: 522, pos_y: 306, estado: 'cerrada',        piso: 'alta', zona: 'vip',     forma: 'sofa'     },
  // Lounge
  { id: 'pa-l1', numero: 30, capacidad: 4, pos_x: 118, pos_y: 426, estado: 'libre',            piso: 'alta', zona: 'lounge',  forma: 'redonda'  },
  { id: 'pa-l2', numero: 31, capacidad: 4, pos_x: 240, pos_y: 426, estado: 'libre',            piso: 'alta', zona: 'lounge',  forma: 'redonda'  },
  { id: 'pa-l3', numero: 32, capacidad: 6, pos_x: 340, pos_y: 426, estado: 'libre',            piso: 'alta', zona: 'lounge',  forma: 'cuadrada' },
]

function getMesasDePiso(piso: PisoType): MesaType[] {
  return piso === 'baja' ? MESAS_BAJA : MESAS_ALTA
}

export function MapaRestaurante({
  mesaSeleccionadaId,
  onSeleccionarMesa,
  mesasCombinadas = [],
  onCambiarCombinadas,
}: MapaRestauranteProps) {
  const [pisoActivo, setPisoActivo] = useState<PisoType>('baja')
  const { cargando } = useMesas(pisoActivo)

  // Todas las mesas vienen de los datos mock definidos aquí (no de useMesas)
  // para que las posiciones y zonas sean siempre correctas.
  const mesas = useMemo(() => getMesasDePiso(pisoActivo), [pisoActivo])

  const [modoUnir, setModoUnir] = useState(false)
  const [selUnir, setSelUnir] = useState<string[]>([])

  const zonas = pisoActivo === 'baja' ? ZONAS_BAJA : ZONAS_ALTA
  const refs  = pisoActivo === 'baja' ? REFS_BAJA  : REFS_ALTA

  /* ── Scale-to-fit usando ResizeObserver ─────────────────────── */
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    if (!wrapperRef.current) return
    const obs = new ResizeObserver(([entry]) => {
      const availableW = entry.contentRect.width
      setScale(availableW < MAP_W ? availableW / MAP_W : 1)
    })
    obs.observe(wrapperRef.current)
    return () => obs.disconnect()
  }, [])

  /* ── Selección de mesas ─────────────────────────────────────── */
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
      {/* ── Header ──────────────────────────────────────────────── */}
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

      {/* ── Contenedor del mapa ──────────────────────────────────── */}
      <div
        ref={wrapperRef}
        className="flex-1 relative bg-noctua-negro border border-noctua-dorado/10 overflow-hidden"
        style={{ minHeight: Math.round(MAP_H * scale) + 2 }}
      >
        {/* Grid decorativo */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(201,169,110,0.7) 1px, transparent 1px),
              linear-gradient(90deg, rgba(201,169,110,0.7) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
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
          <motion.div
            key={pisoActivo}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'relative',
              width: MAP_W,
              height: MAP_H,
              transformOrigin: 'top left',
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
        </AnimatePresence>
      </div>

      {/* ── Pie ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-noctua-cream/30 text-xs font-body tracking-wide">
            {mesasLibres} mesas disponibles · Demo
          </span>
        </div>
        <span className="text-noctua-cream/20 text-[10px] font-body tracking-widest uppercase">
          {pisoActivo === 'baja' ? 'Planta Baja' : 'Planta Alta'}
        </span>
      </div>
    </div>
  )
}
