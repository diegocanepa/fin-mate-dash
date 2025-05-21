import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const symbols = searchParams.get("symbols")
    const types = searchParams.get("types")

    if (!symbols) {
      return NextResponse.json({ error: "Se requiere el parámetro 'symbols'" }, { status: 400 })
    }

    // Parsear los tipos si están presentes
    const typesArray = types ? types.split(",") : []
    const symbolsArray = symbols.split(",")

    // Separar símbolos por tipo
    const stockSymbols: string[] = []
    const cryptoSymbols: string[] = []

    symbolsArray.forEach((symbol, index) => {
      // Si tenemos tipos, usarlos para determinar la categoría
      if (typesArray.length > 0 && index < typesArray.length) {
        if (typesArray[index] === "criptomonedas") {
          cryptoSymbols.push(symbol)
        } else {
          stockSymbols.push(symbol)
        }
      } else {
        // Si no tenemos tipos, usar heurística simple
        // Asumimos que símbolos como BTC, ETH son criptomonedas
        if (["BTC", "ETH", "USDT", "SOL"].includes(symbol)) {
          cryptoSymbols.push(symbol)
        } else {
          stockSymbols.push(symbol)
        }
      }
    })

    // Resultados combinados
    const results: any[] = []

    // Obtener cotizaciones de acciones, bonos y cedears
    if (stockSymbols.length > 0) {
      try {
        const stockSymbolsParam = stockSymbols.join(",")
        const stockApiUrl = `https://stock-quote-api.vercel.app/api/v1/quotes?symbols=${stockSymbolsParam}`
        console.log("Consultando API de acciones:", stockApiUrl)

        const stockResponse = await fetch(stockApiUrl, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })

        if (stockResponse.ok) {
          const stockData = await stockResponse.json()
          if (Array.isArray(stockData)) {
            results.push(...stockData)
          }
        } else {
          console.error("Error en API de acciones:", stockResponse.status)
        }
      } catch (error) {
        console.error("Error al consultar API de acciones:", error)
      }
    }

    // Obtener cotizaciones de criptomonedas
    if (cryptoSymbols.length > 0) {
      try {
        const cryptoResponse = await fetch("/api/crypto/prices")

        if (cryptoResponse.ok) {
          const cryptoData = await cryptoResponse.json()

          // Filtrar solo las criptomonedas solicitadas
          const filteredCryptoData = cryptoData
            .filter((crypto: any) => cryptoSymbols.includes(crypto.symbol))
            .map((crypto: any) => ({
              symbol: crypto.symbol,
              price: crypto.price,
              date: new Date().toISOString().replace("T", " ").substring(0, 19),
              change: crypto.change24h || 0,
              changePercent: crypto.change24h || 0,
            }))

          results.push(...filteredCryptoData)
        } else {
          console.error("Error en API de criptomonedas:", cryptoResponse.status)
        }
      } catch (error) {
        console.error("Error al consultar API de criptomonedas:", error)
      }
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error("Error en API de cotizaciones:", error)
    return NextResponse.json(
      {
        error: "Error al procesar la solicitud",
        message: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    )
  }
}
