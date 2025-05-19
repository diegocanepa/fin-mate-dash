"use client"

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Provider, Session } from "@supabase/supabase-js";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseClientForBrowser } from "./supabase";

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
      return createClient(windowSupabaseUrl, windowSupabaseKey, {
        db: { schema: "public" },
      })
    }
  }

  return null
}

// Iniciar sesión con proveedor OAuth (Google, Facebook, etc.)
export async function signInWithProvider(provider: Provider): Promise<AuthResult> {
  try {
    const supabase = createClientComponentClient()

    if (!supabase) {
      return {
        success: false,
        message: "Servicio de autenticación no disponible. Verifica la configuración de la aplicación.",
      }
    }

    // Definir URL de redirección basada en la URL actual
    const redirectTo = `${window.location.origin}/auth/callback`

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo
      },
    })

    if (error) {
      return {
        success: false,
        message: error.message,
      }
    }

    // No necesitamos devolver nada aquí porque la redirección ya habrá ocurrido
    return {
      success: true,
    }
  } catch (error) {
    return {
      success: false,
      message: "Error al intentar iniciar sesión con proveedor externo",
    }
  }
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
    return {
      success: false,
      message: "Ocurrió un error inesperado al iniciar sesión",
    }
  }
}

// Registrar usuario con email y contraseña
export async function registerWithPassword(email: string, password: string): Promise<AuthResult> {
  try {
    const supabase = getSupabaseClient()

    if (!supabase) {
      return {
        success: false,
        message: "Servicio de autenticación no disponible. Verifica la configuración de la aplicación.",
      }
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      return {
        success: false,
        message: error.message,
      }
    }

    return {
      success: true,
      session: data.session,
      message: "Se ha enviado un correo de confirmación a tu email.",
    }
  } catch (error) {
    return {
      success: false,
      message: "Ocurrió un error inesperado al registrar el usuario",
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
      return null
    }

    const { data } = await supabase.auth.getSession()
    return data.session
  } catch (error) {
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
    return { success: false, message: "An unexpected error occurred" }
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await logout()
  } catch (error) {
    throw new Error("An unexpected error occurred")
  }
}

export const login = loginUser
