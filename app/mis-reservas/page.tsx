'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/providers/AuthProvider'
import { supabase } from '@/lib/supabase'
import { Boton } from '@/components/ui/Boton'
import { Spinner } from '@/components/ui/Spinner'
import { fadeInUp, staggerContainer } from '@/styles/animaciones'
import Link from 'next/link'

interface Reserva {
  id: string
  mesa_id: string
  nombre_cliente: string
  email_cliente: string
  telefono: string
  cantidad_personas: number
  fecha: string
  hora: string
  codigo_reserva: string
  estado: 'activa' | 'cancelada' | 'completada'
  cancelada_en: string | null
  creada_en: string
  mesas: { numero: number } | null
}

export default function MisReservasPage() {
  const { user, loading: authLoading } = useAuth()
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cancelandoId, setCancelandoId] = useState<string | null>(null)

  // Cuando authLoading termina pero user es null, esperamos un grace period
  // por si onAuthStateChange trae el user recién creado con leve delay (signup)
  const [userSettled, setUserSettled] = useState(false)

  // Evitar actualizaciones de estado en componentes desmontados
  const mountedRef = useRef(true)
  const gracePeriodRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchReservas = useCallback(async () => {
    if (!user?.email) return

    setLoading(true)
    setError(null)

    try {
      // Query optimizada: un solo viaje a Supabase con JOIN en mesas
      const { data, error: supabaseError } = await supabase
        .from('reservas')
        .select('*, mesas!mesa_id(numero)')
        .eq('email_cliente', user.email)
        .order('fecha', { ascending: false })

      if (!mountedRef.current) return

      if (supabaseError) {
        console.error('❌ Error Supabase (mis-reservas):', supabaseError.message)
        setError('No pudimos cargar tus reservas. Intentá de nuevo.')
        return
      }

      setReservas((data as Reserva[]) ?? [])
    } catch (err) {
      if (!mountedRef.current) return
      console.error('❌ Error inesperado:', err)
      setError('Ocurrió un error inesperado. Intentá de nuevo.')
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [user?.email])

  // Carga inicial con grace period para evitar mostrar "No identificado"
  // cuando el usuario recién se registró y onAuthStateChange aún no propagó el user
  useEffect(() => {
    mountedRef.current = true

    if (gracePeriodRef.current) {
      clearTimeout(gracePeriodRef.current)
      gracePeriodRef.current = null
    }

    if (!authLoading && user) {
      // Usuario disponible — cancelamos cualquier timer pendiente y cargamos
      setUserSettled(true)
      fetchReservas()
    } else if (!authLoading && !user) {
      // authLoading terminó pero no hay user aún.
      // Esperamos 700ms antes de decidir que definitivamente no hay usuario,
      // cubriendo el caso de signup donde onAuthStateChange llega con delay.
      gracePeriodRef.current = setTimeout(() => {
        if (mountedRef.current) {
          setUserSettled(true)
          setLoading(false)
        }
      }, 700)
    }
    // Si authLoading sigue en true, no hacemos nada (seguimos mostrando spinner)

    return () => {
      mountedRef.current = false
      if (gracePeriodRef.current) {
        clearTimeout(gracePeriodRef.current)
      }
    }
  }, [user, authLoading, fetchReservas])

  // Suscripción Realtime: cuando se crea o actualiza una reserva, re-cargamos
  useEffect(() => {
    if (!user?.email) return

    const channel = supabase
      .channel('mis-reservas-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reservas',
          filter: `email_cliente=eq.${user.email}`,
        },
        () => {
          if (mountedRef.current) fetchReservas()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user?.email, fetchReservas])

  const cancelarReserva = async (codigo: string) => {
    if (!confirm('¿Estás seguro de que deseas cancelar esta reserva?')) return

    setCancelandoId(codigo)
    try {
      const res = await fetch(`/api/reservas?codigo=${codigo}`, {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error('Error al cancelar')

      await fetchReservas()
    } catch {
      alert('No se pudo cancelar la reserva. Por favor intentá de nuevo.')
    } finally {
      setCancelandoId(null)
    }
  }

  // ── Estados de carga / error / sin sesión ──────────────────────────────────

  // Mostramos spinner mientras: authLoading activo, o grace period no terminó, o fetch en curso
  if (authLoading || !userSettled || (loading && reservas.length === 0)) {
    return (
      <div className="min-h-screen bg-noctua-negro flex items-center justify-center">
        <Spinner tamaño="lg" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-noctua-negro flex flex-col items-center justify-center p-6 text-center">
        <h1 className="font-display text-4xl text-noctua-dorado mb-4">No identificado</h1>
        <p className="font-body text-noctua-cream/60 mb-8 max-w-md">
          Para ver tus reservas, primero debés iniciar sesión o hacer una reserva con tu email.
        </p>
        <Link href="/reservas">
          <Boton variante="primario">Ir a Reservar</Boton>
        </Link>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-noctua-negro flex flex-col items-center justify-center p-6 text-center gap-6">
        <p className="font-body text-noctua-vino text-lg">{error}</p>
        <Boton variante="primario" onClick={fetchReservas}>
          Reintentar
        </Boton>
      </div>
    )
  }

  // ── Clasificación de reservas ──────────────────────────────────────────────

  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)

  const activas = reservas.filter(
    (r) => r.estado === 'activa' && new Date(r.fecha + 'T12:00') >= hoy
  )
  const historial = reservas.filter(
    (r) => r.estado !== 'activa' || new Date(r.fecha + 'T12:00') < hoy
  )

  return (
    <div className="min-h-screen bg-noctua-negro pt-32 pb-20 px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="flex flex-col gap-12"
        >
          {/* Header */}
          <motion.div variants={fadeInUp} className="border-b border-noctua-dorado/10 pb-8">
            <h1 className="font-display text-5xl text-noctua-cream mb-2 tracking-tight">
              Mis Reservas
            </h1>
            <p className="font-body text-noctua-dorado/60 tracking-[0.2em] uppercase text-xs">
              Gestioná tu experiencia en NOCTUA
            </p>
          </motion.div>

          {/* Reservas Activas */}
          <section className="flex flex-col gap-6">
            <h2 className="font-display text-2xl text-noctua-dorado tracking-widest uppercase">
              Próximas Reservas
            </h2>

            {loading && activas.length === 0 ? (
              <div className="flex justify-center py-12">
                <Spinner tamaño="md" />
              </div>
            ) : activas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence mode="popLayout">
                  {activas.map((reserva) => (
                    <ReservaCard
                      key={reserva.id}
                      reserva={reserva}
                      onCancel={cancelarReserva}
                      cancelando={cancelandoId === reserva.codigo_reserva}
                    />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="border border-noctua-dorado/10 bg-noctua-dorado/5 p-12 text-center">
                <p className="font-body text-noctua-cream/40 italic">No tenés reservas activas.</p>
                <Link
                  href="/reservas"
                  className="inline-block mt-4 text-noctua-dorado hover:text-noctua-dorado-claro transition-colors text-sm underline underline-offset-4"
                >
                  Hacer una reserva ahora
                </Link>
              </div>
            )}
          </section>

          {/* Historial */}
          {historial.length > 0 && (
            <section className="flex flex-col gap-6 opacity-60">
              <h2 className="font-display text-2xl text-noctua-cream/40 tracking-widest uppercase">
                Historial
              </h2>
              <div className="flex flex-col gap-4">
                {historial.map((reserva) => (
                  <div
                    key={reserva.id}
                    className="flex flex-wrap items-center justify-between p-4 border border-noctua-dorado/5 bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex flex-col gap-1">
                      <p className="font-body text-noctua-cream text-sm">
                        Mesa {reserva.mesas?.numero ?? '?'} —{' '}
                        {new Date(reserva.fecha + 'T12:00').toLocaleDateString('es-AR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                      <p className="font-body text-noctua-cream/40 text-xs uppercase tracking-tighter">
                        {reserva.hora} hs • {reserva.cantidad_personas} personas •{' '}
                        {reserva.codigo_reserva}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-[10px] uppercase tracking-[0.2em] px-2 py-1 border ${
                          reserva.estado === 'cancelada'
                            ? 'border-noctua-vino/30 text-noctua-vino/60'
                            : 'border-noctua-dorado/30 text-noctua-dorado/60'
                        }`}
                      >
                        {reserva.estado}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </motion.div>
      </div>
    </div>
  )
}

// ── ReservaCard ──────────────────────────────────────────────────────────────

function ReservaCard({
  reserva,
  onCancel,
  cancelando,
}: {
  reserva: Reserva
  onCancel: (codigo: string) => void
  cancelando: boolean
}) {
  return (
    <motion.div
      layout
      variants={fadeInUp}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group relative border border-noctua-dorado/20 bg-noctua-dorado/[0.03] p-6 hover:border-noctua-dorado/40 transition-all duration-500 overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-noctua-dorado/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-noctua-dorado/10 transition-colors duration-500" />

      <div className="relative flex flex-col gap-6">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-noctua-dorado tracking-[0.3em] uppercase mb-1">
              Reserva Confirmada
            </span>
            <h3 className="font-display text-3xl text-noctua-cream leading-none">
              Mesa {reserva.mesas?.numero ?? '?'}
            </h3>
          </div>
          <div className="bg-noctua-dorado/10 border border-noctua-dorado/20 px-3 py-1">
            <span className="font-mono text-xs text-noctua-dorado font-bold tracking-widest">
              {reserva.codigo_reserva}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-y border-noctua-dorado/10 py-4">
          <div>
            <p className="text-[10px] text-noctua-cream/30 uppercase tracking-widest mb-1">Fecha</p>
            <p className="font-body text-sm text-noctua-cream">
              {new Date(reserva.fecha + 'T12:00').toLocaleDateString('es-AR', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-noctua-cream/30 uppercase tracking-widest mb-1">
              Horario
            </p>
            <p className="font-body text-sm text-noctua-cream">{reserva.hora} hs</p>
          </div>
          <div>
            <p className="text-[10px] text-noctua-cream/30 uppercase tracking-widest mb-1">
              Comensales
            </p>
            <p className="font-body text-sm text-noctua-cream">
              {reserva.cantidad_personas} personas
            </p>
          </div>
          <div>
            <p className="text-[10px] text-noctua-cream/30 uppercase tracking-widest mb-1">
              Estado
            </p>
            <p className="font-body text-sm text-noctua-dorado uppercase tracking-widest">
              {reserva.estado}
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={() => onCancel(reserva.codigo_reserva)}
            disabled={cancelando}
            className="text-noctua-vino hover:text-noctua-vino/80 text-[10px] font-body tracking-[0.3em] uppercase transition-colors disabled:opacity-50"
          >
            {cancelando ? 'Cancelando...' : 'Cancelar Reserva'}
          </button>
        </div>
      </div>
    </motion.div>
  )
}
