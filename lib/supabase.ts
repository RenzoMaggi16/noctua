import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Log de diagnóstico (seguro para producción)
if (typeof window !== 'undefined') {
  console.log('🔌 Supabase Initialized:', {
    url: supabaseUrl?.substring(0, 15) + '...',
    hasKey: !!supabaseAnonKey,
    keyPrefix: supabaseAnonKey?.substring(0, 10) + '...'
  })
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
