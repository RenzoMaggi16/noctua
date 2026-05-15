'use client'

import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

interface Profile {
  id: string
  nombre: string
  telefono: string
  created_at: string
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  // Evita actualizaciones de estado en el componente desmontado
  const mountedRef = useRef(true)

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (!mountedRef.current) return

      if (error) {
        if (error.code !== 'PGRST116') {
          console.error('Error fetching profile:', error)
        }
        setProfile(null)
      } else {
        setProfile(data)
      }
    } catch (err) {
      if (!mountedRef.current) return
      console.error('Error in fetchProfile:', err)
      setProfile(null)
    }
  }

  useEffect(() => {
    mountedRef.current = true

    // 1. Sesión inicial — una sola vez al montar
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!mountedRef.current) return

        if (session?.user) {
          setUser(session.user)
          await fetchProfile(session.user.id)
        } else {
          setUser(null)
          setProfile(null)
        }
      } catch (err) {
        console.error('Error en initAuth:', err)
      } finally {
        if (mountedRef.current) setLoading(false)
      }
    }

    initAuth()

    // 2. Escuchar cambios de sesión (login, signup, logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mountedRef.current) return

      const nextUser = session?.user ?? null
      setUser(nextUser)

      if (nextUser) {
        // No ponemos loading=true aquí para evitar flicker; actualizamos en background
        await fetchProfile(nextUser.id)
      } else {
        setProfile(null)
      }

      // Solo sacamos el loading global si todavía estaba activo (primer ciclo)
      if (mountedRef.current) setLoading(false)
    })

    return () => {
      mountedRef.current = false
      subscription.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    if (mountedRef.current) {
      setUser(null)
      setProfile(null)
    }
  }

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id)
    }
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
