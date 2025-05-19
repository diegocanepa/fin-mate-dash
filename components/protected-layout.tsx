"use client"

import { LoginScreen } from "@/components/login-screen"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { LogOut } from "lucide-react"
import type { ReactNode } from "react"

export function ProtectedLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading, logout } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginScreen />
  }

  return (
    <>
      {/* Botón de cierre de sesión */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button variant="outline" size="sm" onClick={logout} className="flex items-center gap-2">
          <LogOut className="h-4 w-4" />
          <span>Cerrar sesión</span>
        </Button>
      </div>
      {children}
    </>
  )
}
