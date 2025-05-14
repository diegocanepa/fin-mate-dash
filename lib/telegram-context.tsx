"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

type TelegramContextType = {
  isLinked: boolean
  setIsLinked: (value: boolean) => void
  isLinking: boolean
  setIsLinking: (value: boolean) => void
}

const TelegramContext = createContext<TelegramContextType | undefined>(undefined)

export function TelegramProvider({ children }: { children: ReactNode }) {
  const [isLinked, setIsLinked] = useState(false)
  const [isLinking, setIsLinking] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Verificar si el usuario ya ha vinculado Telegram
  useEffect(() => {
    if (typeof window !== "undefined") {
      const linkedStatus = localStorage.getItem("telegramLinked") === "true"
      setIsLinked(linkedStatus)
    }
  }, [])

  // Redirigir al usuario a la página de vinculación si no está vinculado
  useEffect(() => {
    // Excluir la página de vinculación y las rutas de autenticación
    const isAuthRoute = pathname === "/" || pathname.startsWith("/auth")
    const isTelegramRoute = pathname === "/vincular-telegram"

    if (!isLinked && !isTelegramRoute && !isAuthRoute) {
      router.push("/vincular-telegram")
    }
  }, [isLinked, pathname, router])

  return (
    <TelegramContext.Provider value={{ isLinked, setIsLinked, isLinking, setIsLinking }}>
      {children}
    </TelegramContext.Provider>
  )
}

export function useTelegram() {
  const context = useContext(TelegramContext)
  if (context === undefined) {
    throw new Error("useTelegram must be used within a TelegramProvider")
  }
  return context
}
