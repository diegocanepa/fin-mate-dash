"use client"

import { useState, useEffect } from "react"

/**
 * Custom hook para detectar si un media query coincide
 * @param query El media query a evaluar
 * @returns boolean que indica si el media query coincide
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    // Configuración para SSR/SSG - tomamos false como valor predeterminado
    if (typeof window === "undefined") {
      return
    }

    const media = window.matchMedia(query)

    // Establece el estado inicial
    setMatches(media.matches)

    // Callback para actualizar el estado
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    // Agregar listener
    if (media.addEventListener) {
      media.addEventListener("change", listener)
    } else {
      // Soporte para navegadores antiguos
      media.addListener(listener)
    }

    // Limpiar recursos
    return () => {
      if (media.removeEventListener) {
        media.removeEventListener("change", listener)
      } else {
        // Soporte para navegadores antiguos
        media.removeListener(listener)
      }
    }
  }, [query])

  return matches
}
