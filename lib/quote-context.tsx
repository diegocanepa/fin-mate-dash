"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { getAllSymbolsWithTypes } from "@/lib/investment-data"

// Definir la interfaz para el contexto
interface QuoteContextType {
  realTimePrices: Record<string, number>
  isLoading: boolean
  error: string | null
  lastUpdated: Date | null
  fetchQuotes: () => Promise<void>
}

// Crear el contexto con un valor predeterminado
const QuoteContext = createContext<QuoteContextType>({
  realTimePrices: {},
  isLoading: false,
  error: null,
  lastUpdated: null,
  fetchQuotes: async () => {},
})

// Hook personalizado para usar el contexto
export const useQuotes = () => useContext(QuoteContext)

// Proveedor del contexto
export function QuoteProvider({ children }: { children: ReactNode }) {
  const [realTimePrices, setRealTimePrices] = useState<Record<string, number>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // Función para obtener cotizaciones
  const fetchQuotes = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Obtener símbolos con sus tipos
      const { symbols, types } = getAllSymbolsWithTypes()

      if (symbols.length === 0) {
        setIsLoading(false)
        return
      }

      // Usar la URL correcta de nuestra API interna, incluyendo los tipos
      const response = await fetch(`/api/quotes?symbols=${symbols.join(",")}&types=${types.join(",")}`)

      if (!response.ok) {
        throw new Error(`Error al obtener cotizaciones: ${response.status}`)
      }

      const data = await response.json()

      // Verificar si hay un error en la respuesta
      if (data.error) {
        throw new Error(`Error de la API: ${data.error}`)
      }

      // Crear un objeto con los precios actualizados
      const prices: Record<string, number> = {}

      // Manejar tanto array como objeto con propiedad quotes
      const quotes = Array.isArray(data) ? data : data.quotes || []

      if (quotes.length === 0) {
        console.warn("No se encontraron cotizaciones")
      }

      for (const quote of quotes) {
        if (quote && quote.symbol && typeof quote.price === "number") {
          // Eliminar el sufijo .BA si existe
          const symbol = quote.symbol.replace(".BA", "")
          prices[symbol] = quote.price
        }
      }

      setRealTimePrices(prices)
      setLastUpdated(new Date())
      console.log("Cotizaciones actualizadas:", prices)
    } catch (error) {
      console.error("Error al obtener cotizaciones en tiempo real:", error)
      setError(error instanceof Error ? error.message : "Error desconocido")
    } finally {
      setIsLoading(false)
    }
  }

  // Obtener cotizaciones al montar el componente
  useEffect(() => {
    fetchQuotes()

    // Actualizar cada 5 minutos
    const interval = setInterval(fetchQuotes, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <QuoteContext.Provider value={{ realTimePrices, isLoading, error, lastUpdated, fetchQuotes }}>
      {children}
    </QuoteContext.Provider>
  )
}
