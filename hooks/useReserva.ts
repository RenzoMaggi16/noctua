'use client'

import { useState, useCallback } from 'react'
import type { EstadoReservaForm, Mesa } from '@/types'
import { obtenerFechaHoy } from '@/lib/validaciones'

const ESTADO_INICIAL: EstadoReservaForm = {
  mesaSeleccionada: null,
  fecha: obtenerFechaHoy(),
  hora: '',
  cantidadPersonas: 1,
  nombre: '',
  email: '',
  telefono: '',
}

interface UseReservaReturn {
  estado: EstadoReservaForm
  seleccionarMesa: (mesa: Mesa) => void
  deseleccionarMesa: () => void
  actualizarCampo: <K extends keyof EstadoReservaForm>(
    campo: K,
    valor: EstadoReservaForm[K]
  ) => void
  resetear: () => void
}

export function useReserva(): UseReservaReturn {
  const [estado, setEstado] = useState<EstadoReservaForm>(ESTADO_INICIAL)

  const seleccionarMesa = useCallback((mesa: Mesa) => {
    setEstado((prev) => ({
      ...prev,
      mesaSeleccionada: mesa,
      cantidadPersonas: Math.min(prev.cantidadPersonas || 1, mesa.capacidad),
    }))
  }, [])

  const deseleccionarMesa = useCallback(() => {
    setEstado((prev) => ({ ...prev, mesaSeleccionada: null }))
  }, [])

  const actualizarCampo = useCallback(
    <K extends keyof EstadoReservaForm>(campo: K, valor: EstadoReservaForm[K]) => {
      setEstado((prev) => ({ ...prev, [campo]: valor }))
    },
    []
  )

  const resetear = useCallback(() => {
    setEstado(ESTADO_INICIAL)
  }, [])

  return { estado, seleccionarMesa, deseleccionarMesa, actualizarCampo, resetear }
}
