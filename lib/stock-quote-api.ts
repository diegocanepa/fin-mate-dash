/**
 * Servicio para consultar la API de cotizaciones en tiempo real
 * Basado en https://github.com/diegocanepa/stock-quote-api
 */

const API_BASE_URL = "https://stock-quote-api.vercel.app/api/v1/quotes"

export interface StockQuote {
  symbol: string
  price: number
  date?: string
  change?: number
  changePercent?: number
  currency?: string
}

export interface QuoteResponse {
  quotes: StockQuote[]
  timestamp: number
}

/**
 * Obtiene las cotizaciones en tiempo real para los símbolos especificados
 * @param symbols Array de símbolos a consultar
 * @returns Objeto con las cotizaciones
 */
export async function getStockQuotes(symbols: string[]): Promise<QuoteResponse> {
  try {
    if (!symbols.length) {
      return { quotes: [], timestamp: Date.now() }
    }

    const symbolsParam = symbols.join(",")
    const response = await fetch(`${API_BASE_URL}?symbols=${symbolsParam}`)

    if (!response.ok) {
      console.error(`Error en respuesta API: ${response.status}`)
      return { quotes: [], timestamp: Date.now() }
    }

    const data = await response.json()

    // Si la respuesta es un array, significa que la API devuelve directamente los quotes
    if (Array.isArray(data)) {
      return {
        quotes: data,
        timestamp: Date.now(),
      }
    }

    // Si la respuesta es un objeto con quotes, usamos esa estructura
    if (data && data.quotes && Array.isArray(data.quotes)) {
      return data
    }

    // En caso de cualquier otra estructura, registramos y devolvemos vacío
    console.error("Respuesta de API con estructura inesperada:", data)
    return { quotes: [], timestamp: Date.now() }
  } catch (error) {
    console.error("Error al obtener cotizaciones:", error)
    return { quotes: [], timestamp: Date.now() }
  }
}

/**
 * Obtiene la cotización actual para un símbolo específico
 * @param symbol Símbolo a consultar
 * @returns Cotización actual o undefined si no se encuentra
 */
export async function getStockQuote(symbol: string): Promise<StockQuote | undefined> {
  const response = await getStockQuotes([symbol])
  return response.quotes.find((quote) => quote.symbol === symbol)
}
