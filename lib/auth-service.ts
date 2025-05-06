"use client"

import { getSupabaseClientForBrowser } from "./supabase"
import type { Session } from "@supabase/supabase-js"
import { createClient } from "@supabase/supabase-js"

export type AuthResult = {
  success: boolean
  message?: string
  session?: Session | null
}

// Función para obtener un cliente de Supabase utilizando las variables inyectadas si es necesario
function getSupabaseClient() {
  // Intentar obtener el cliente normal primero
  const client = getSupabaseClientForBrowser()
  if (client) return client

  // Si no está disponible, intentar crear uno con las variables inyectadas
  if (typeof window !== "undefined") {
    const windowSupabaseUrl = (window as any).__NEXT_PUBLIC_SUPABASE_URL
    const windowSupabaseKey = (window as any).__NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (windowSupabaseUrl && windowSupabaseKey) {
      console.log("Creando cliente Supabase con variables inyectadas")
      return createClient(windowSupabaseUrl, windowSupabaseKey, {
        db: { schema: "public" },
      })
    }
  }

  return null
}

// Iniciar sesión con email y contraseña
export async function loginWithPassword(email: string, password: string): Promise<AuthResult> {
  try {
    const supabase = getSupabaseClient()

    if (!supabase) {
      return {
        success: false,
        message: "Servicio de autenticación no disponible. Verifica la configuración de la aplicación.",
      }
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      // Personalizar mensajes de error para hacerlos más amigables
      if (error.message.includes("Invalid login credentials")) {
        return {
          success: false,
          message: "Email o contraseña incorrectos. Por favor, inténtalo de nuevo.",
        }
      }

      if (error.message.includes("Email not confirmed")) {
        return {
          success: false,
          message: "El email no ha sido confirmado. Por favor, revisa tu bandeja de entrada.",
        }
      }

      return {
        success: false,
        message: error.message,
      }
    }

    return {
      success: true,
      session: data.session,
    }
  } catch (error) {
    console.error("Error al iniciar sesión:", error)
    return {
      success: false,
      message: "Ocurrió un error inesperado al iniciar sesión",
    }
  }
}

// Cerrar sesión
export async function logout(): Promise<AuthResult> {
  try {
    const supabase = getSupabaseClient()

    if (!supabase) {
      return {
        success: false,
        message: "Servicio de autenticación no disponible. Verifica la configuración de la aplicación.",
      }
    }

    const { error } = await supabase.auth.signOut()

    if (error) {
      return {
        success: false,
        message: error.message,
      }
    }

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error al cerrar sesión:", error)
    return {
      success: false,
      message: "Ocurrió un error inesperado al cerrar sesión",
    }
  }
}

// Obtener la sesión actual
export async function getCurrentSession(): Promise<Session | null> {
  try {
    const supabase = getSupabaseClient()

    if (!supabase) {
      console.warn("Supabase client not available. Cannot get current session.")
      return null
    }

    const { data } = await supabase.auth.getSession()
    return data.session
  } catch (error) {
    console.error("Error al obtener la sesión:", error)
    return null
  }
}

// Verificar si el usuario está autenticado
export async function isAuthenticated(): Promise<boolean> {
  const session = await getCurrentSession()
  return session !== null
}

// Suscribirse a cambios en la autenticación
export function onAuthStateChange(callback: (session: Session | null) => void) {
  try {
    const supabase = getSupabaseClient()

    if (!supabase) {
      console.warn("Supabase client not available. Auth state changes will not be tracked.")
      // Devolver un objeto de suscripción falso
      return {
        unsubscribe: () => {},
      }
    }

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      callback(session)
    })

    return data.subscription
  } catch (error) {
    console.error("Error setting up auth state change listener:", error)
    // Devolver un objeto de suscripción falso
    return {
      unsubscribe: () => {},
    }
  }
}

export async function verifySession(): Promise<boolean> {
  const session = await getCurrentSession()
  return session !== null
}

export async function loginUser(
  email: string,
  password: string,
  ip: string,
): Promise<{ success: boolean; message?: string }> {
  try {
    const result = await loginWithPassword(email, password)

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Authentication failed",
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, message: "An unexpected error occurred" }
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await logout()
  } catch (error) {
    console.error("Logout error:", error)
    throw new Error("An unexpected error occurred")
  }
}

export const login = loginUser
