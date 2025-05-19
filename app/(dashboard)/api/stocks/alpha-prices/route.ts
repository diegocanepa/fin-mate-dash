import { NextResponse } from "next/server"

// Símbolos de acciones y bonos que queremos consultar
const STOCK_SYMBOLS = ["AAPL", "MELI", "GOOGL", "LOMA"]
const BOND_ETF_SYMBOLS = ["SPY", "QQQ", "GLD", "AGG"] // Reemplazamos AL30D y AL35D por ETFs más comunes ya que Alpha Vantage no tiene datos de bonos argentinos

// Función para obtener datos de Alpha Vantage
async function fetchStockData(symbol: string) {
  try {
    // Usamos la API key de Alpha Vantage (se puede obtener una gratuita en https://www.alphavantage.co/support/#api-key)
    const API_KEY = process.env.ALPHA_VANTAGE_API_KEY || "demo" // Usamos "demo" como fallback para pruebas

    // Obtenemos datos de cotización global
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`,
    )

    if (!response.ok) {
      throw new Error(`Error al obtener datos para ${symbol}: ${response.statusText}`)
    }

    const data = await response.json()

    // Si no hay datos o hay un error, lanzamos una excepción
    if (data["Error Message"] || !data["Global Quote"] || Object.keys(data["Global Quote"]).length === 0) {
      throw new Error(`No se encontraron datos para ${symbol}`)
    }

    const quote = data["Global Quote"]

    // Formateamos los datos para que sean más fáciles de usar
    return {
      symbol,
      price: Number.parseFloat(quote["05. price"]),
      change: Number.parseFloat(quote["09. change"]),
      changePercent: Number.parseFloat(quote["10. change percent"].replace("%", "")),
      high: Number.parseFloat(quote["03. high"]),
      low: Number.parseFloat(quote["04. low"]),
      volume: Number.parseInt(quote["06. volume"]),
      latestTradingDay: quote["07. latest trading day"],
      previousClose: Number.parseFloat(quote["08. previous close"]),
      open: Number.parseFloat(quote["02. open"]),
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    console.error(`Error al obtener datos para ${symbol}:`, error)
    // Devolvemos un objeto con información de error
    return {
      symbol,
      error: true,
      errorMessage: error instanceof Error ? error.message : "Error desconocido",
      timestamp: new Date().toISOString(),
    }
  }
}

// Función para determinar la categoría de un símbolo
function getSymbolCategory(symbol: string) {
  if (STOCK_SYMBOLS.includes(symbol)) return "stock"
  if (BOND_ETF_SYMBOLS.includes(symbol)) return "bond_etf"
  return "unknown"
}

export async function GET() {
  try {
    // Combinamos todos los símbolos
    const allSymbols = [...STOCK_SYMBOLS, ...BOND_ETF_SYMBOLS]

    // Obtenemos datos para todos los símbolos
    const promises = allSymbols.map((symbol) => fetchStockData(symbol))
    const results = await Promise.all(promises)

    // Organizamos los resultados por categoría
    const stocksData = results.filter((data) => !data.error && getSymbolCategory(data.symbol) === "stock")

    const bondsEtfsData = results.filter((data) => !data.error && getSymbolCategory(data.symbol) === "bond_etf")

    const errors = results.filter((data) => data.error)

    return NextResponse.json({
      stocks: stocksData,
      bonds_etfs: bondsEtfsData,
      errors: errors.length > 0 ? errors : undefined,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error al obtener cotizaciones:", error)
    return NextResponse.json(
      {
        error: "Error al obtener cotizaciones",
        message: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    )
  }
}
