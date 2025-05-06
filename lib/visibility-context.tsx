"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

interface VisibilityContextType {
  isVisible: boolean
  toggleVisibility: () => void
}

const VisibilityContext = createContext<VisibilityContextType | undefined>(undefined)

export function VisibilityProvider({ children }: { children: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Recuperar el estado de visibilidad del localStorage
    const storedVisibility = localStorage.getItem("finmate-visibility")
    if (storedVisibility !== null) {
      setIsVisible(storedVisibility === "true")
    }
    setIsInitialized(true)
  }, [])

  const toggleVisibility = () => {
    const newVisibility = !isVisible
    setIsVisible(newVisibility)
    // Guardar el estado de visibilidad en localStorage
    localStorage.setItem("finmate-visibility", String(newVisibility))

    // Forzar un reflow para evitar problemas de renderizado
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"))
    }, 100)
  }

  // No renderizar nada hasta que se haya inicializado
  if (!isInitialized) {
    return null
  }

  return <VisibilityContext.Provider value={{ isVisible, toggleVisibility }}>{children}</VisibilityContext.Provider>
}

export function useVisibility() {
  const context = useContext(VisibilityContext)
  if (context === undefined) {
    throw new Error("useVisibility must be used within a VisibilityProvider")
  }
  return context
}
