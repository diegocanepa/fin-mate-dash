"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Session } from "@supabase/supabase-js"
import { loginWithPassword, logout, getCurrentSession, onAuthStateChange } from "./auth-service"

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  session: Session | null
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [session, setSession] = useState<Session | null>(null)

  // Verificar la sesión al cargar el componente
  useEffect(() => {
    const checkSession = async () => {
      try {
        const currentSession = await getCurrentSession()
        setSession(currentSession)
        setIsAuthenticated(currentSession !== null)
      } catch (error) {
        console.error("Error al verificar la sesión:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()

    // Suscribirse a cambios en la autenticación
    const subscription = onAuthStateChange((updatedSession) => {
      setSession(updatedSession)
      setIsAuthenticated(updatedSession !== null)
    })

    // Limpiar la suscripción al desmontar
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const result = await loginWithPassword(email, password)

      if (result.success && result.session) {
        setSession(result.session)
        setIsAuthenticated(true)
        return { success: true }
      }

      return {
        success: false,
        message: result.message || "Error de autenticación",
      }
    } catch (error) {
      console.error("Error de inicio de sesión:", error)
      return {
        success: false,
        message: "Ocurrió un error inesperado",
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      setIsLoading(true)
      await logout()
      setSession(null)
      setIsAuthenticated(false)
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        session,
        login,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider")
  }
  return context
}
