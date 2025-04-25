"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface VisibilityContextType {
  isVisible: boolean
  toggleVisibility: () => void
}

const VisibilityContext = createContext<VisibilityContextType | undefined>(undefined)

export function VisibilityProvider({ children }: { children: ReactNode }) {
  // Por defecto, los datos son visibles
  const [isVisible, setIsVisible] = useState(true)

  // Cargar la preferencia del usuario desde localStorage al iniciar
  useEffect(() => {
    try {
      const savedVisibility = localStorage.getItem("dataVisibility")
      if (savedVisibility !== null) {
        setIsVisible(savedVisibility === "true")
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error)
    }
  }, [])

  // Función para alternar la visibilidad
  const toggleVisibility = () => {
    try {
      const newVisibility = !isVisible
      setIsVisible(newVisibility)
      // Guardar la preferencia en localStorage
      localStorage.setItem("dataVisibility", String(newVisibility))
    } catch (error) {
      console.error("Error saving to localStorage:", error)
      // Si hay un error con localStorage, al menos cambiamos el estado en memoria
      setIsVisible(!isVisible)
    }
  }

  return <VisibilityContext.Provider value={{ isVisible, toggleVisibility }}>{children}</VisibilityContext.Provider>
}

export function useVisibility() {
  const context = useContext(VisibilityContext)
  if (context === undefined) {
    throw new Error("useVisibility debe ser usado dentro de un VisibilityProvider")
  }
  return context
}
