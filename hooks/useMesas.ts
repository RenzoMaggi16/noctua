'use client'

import { useState, useEffect, useCallback } from 'react'
import { getMesasMock } from '@/lib/mesasMock'
import type { Mesa, PisoType } from '@/types'

interface UseMesasReturn {
  mesas: Mesa[]
  cargando: boolean
  error: string | null
  actualizarEstadoMesa: (id: string, updates: Partial<Mesa>) => void
}

/**
 * Hook de mesas — usa datos estáticos de demo.
 * El estado se guarda localmente (en memoria) para simular
 * actualizaciones en tiempo real cuando el usuario reserva.
 */
export function useMesas(piso: PisoType): UseMesasReturn {
  const [mesas, setMesas] = useState<Mesa[]>([])
  const [cargando, setCargando] = useState(true)
  const [error] = useState<string | null>(null)

  const cargarMesas = useCallback(() => {
    setCargando(true)
    // Simular una pequeña latencia de carga para que se vea el spinner
    setTimeout(() => {
      setMesas(getMesasMock(piso))
      setCargando(false)
    }, 400)
  }, [piso])

  useEffect(() => {
    cargarMesas()
  }, [cargarMesas])

  const actualizarEstadoMesa = useCallback((id: string, updates: Partial<Mesa>) => {
    setMesas((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)))
  }, [])

  return { mesas, cargando, error, actualizarEstadoMesa }
}
