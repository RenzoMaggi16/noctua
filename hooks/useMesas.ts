'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Mesa, PisoType, MesaEstado } from '@/types'

interface UseMesasReturn {
  mesas: Mesa[]
  cargando: boolean
  error: string | null
  recargarMesas: () => Promise<void>
  actualizarEstadoMesa: (id: string, updates: Partial<Mesa>) => void
}

/**
 * Hook de mesas — Fuente de verdad exclusiva: Supabase.
 * Carga las mesas reales de la DB filtradas por piso y sincroniza con reservas.
 */
export function useMesas(
  piso: PisoType,
  fechaSeleccionada?: string,
  horaSeleccionada?: string
): UseMesasReturn {
  const [mesas, setMesas] = useState<Mesa[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const cargarMesas = useCallback(async () => {
    setCargando(true)
    setError(null)
    
    try {
      console.log(`🔍 Cargando mesas desde Supabase para el piso: ${piso}...`)

      // 1. Consultar mesas reales filtradas por piso
      const { data: mesasDb, error: mesasError } = await supabase
        .from('mesas')
        .select('*')
        .eq('piso', piso)
        .order('numero', { ascending: true })

      if (mesasError) {
        console.error('❌ Error Supabase (mesas):', {
          message: mesasError.message,
          code: mesasError.code,
          details: mesasError.details,
          hint: mesasError.hint,
        })
        throw mesasError
      }

      console.log(`✅ ${mesasDb?.length || 0} mesas cargadas exitosamente para ${piso}.`)

      // 2. Consultar reservas para la fecha y hora seleccionada
      let idsReservados = new Set<string>()
      
      if (fechaSeleccionada && horaSeleccionada) {
        const { data: reservas, error: resError } = await supabase
          .from('reservas')
          .select('mesa_id, mesas_ids')
          .eq('fecha', fechaSeleccionada)
          .eq('hora', horaSeleccionada)

        if (resError) {
          console.error('⚠️ Error Supabase (reservas):', resError.message)
          // No bloqueamos la carga de mesas si fallan las reservas
        } else {
          // Recolectamos todos los IDs de mesas reservadas, incluyendo uniones
          reservas?.forEach(r => {
            if (r.mesas_ids && Array.isArray(r.mesas_ids)) {
              r.mesas_ids.forEach((id: string) => idsReservados.add(id))
            } else if (r.mesa_id) {
              idsReservados.add(r.mesa_id)
            }
          })
        }
      }

      // 3. Mapear y validar datos de la DB
      const mesasValidadas: Mesa[] = (mesasDb || []).map(m => ({
        ...m,
        // Aseguramos que las posiciones sean números
        pos_x: Number(m.pos_x),
        pos_y: Number(m.pos_y),
        // La mesa está ocupada SOLAMENTE si tiene una reserva activa para esta fecha y hora
        // Ignoramos el campo 'estado' de la tabla mesas para que la disponibilidad sea puramente temporal
        estado: (idsReservados.has(m.id) ? 'ocupada' : 'libre') as MesaEstado
      }))

      setMesas(mesasValidadas)
    } catch (err: any) {
      const mensaje = err?.message || 'Error de conexión con Supabase'
      setError(`Error: ${mensaje}`)
    } finally {
      setCargando(false)
    }
  }, [piso, fechaSeleccionada, horaSeleccionada])

  useEffect(() => {
    cargarMesas()
  }, [cargarMesas])

  const actualizarEstadoMesa = useCallback((id: string, updates: Partial<Mesa>) => {
    setMesas((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)))
  }, [])

  return { 
    mesas, 
    cargando, 
    error, 
    recargarMesas: cargarMesas,
    actualizarEstadoMesa 
  }
}
