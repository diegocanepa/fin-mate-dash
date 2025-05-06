"use client"

import { useEffect } from "react"

interface EnvInjectorProps {
  supabaseUrl: string
  supabaseAnonKey: string
}

export function EnvInjector({ supabaseUrl, supabaseAnonKey }: EnvInjectorProps) {
  useEffect(() => {
    // Inyectar las variables de entorno en el objeto window
    // Esto es una solución alternativa para casos donde las variables de entorno no se cargan correctamente
    ;(window as any).__NEXT_PUBLIC_SUPABASE_URL = supabaseUrl
    ;(window as any).__NEXT_PUBLIC_SUPABASE_ANON_KEY = supabaseAnonKey

    console.log("Variables de entorno inyectadas en window")
  }, [supabaseUrl, supabaseAnonKey])

  // Este componente no renderiza nada
  return null
}
