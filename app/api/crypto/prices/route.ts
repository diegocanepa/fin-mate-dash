import { NextResponse } from "next/server"

// Función para obtener los precios de criptomonedas desde CoinMarketCap
async function getCryptoPrices() {
  try {
    // Verificar si tenemos la API key de CoinMarketCap
    const apiKey = process.env.COINMARKETCAP_API_KEY

    if (!apiKey) {
      console.warn("No se encontró la API key de CoinMarketCap. Usando datos de ejemplo.")
      return getMockCryptoPrices()
    }

    const response = await fetch(
      "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=BTC,ETH,XRP",
      {
        headers: {
          "X-CMC_PRO_API_KEY": apiKey,
        },
        next: { revalidate: 300 }, // Revalidar cada 5 minutos
      },
    )

    if (!response.ok) {
      throw new Error(`Error en la API de CoinMarketCap: ${response.statusText}`)
    }

    const data = await response.json()

    // Transformar los datos al formato que necesitamos
    const prices = Object.entries(data.data).map(([symbol, info]: [string, any]) => ({
      symbol,
      name: info.name,
      price: info.quote.USD.price,
      change24h: info.quote.USD.percent_change_24h,
      marketCap: info.quote.USD.market_cap,
      volume24h: info.quote.USD.volume_24h,
    }))

    return prices
  } catch (error) {
    console.error("Error al obtener precios de criptomonedas:", error)
    return getMockCryptoPrices()
  }
}

// Función para generar datos de ejemplo
function getMockCryptoPrices() {
  return [
    {
      symbol: "BTC",
      name: "Bitcoin",
      price: 65432.1,
      change24h: 2.5,
      marketCap: 1250000000000,
      volume24h: 25000000000,
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      price: 3456.78,
      change24h: -1.2,
      marketCap: 420000000000,
      volume24h: 15000000000,
    },
    {
      symbol: "XRP",
      name: "XRP",
      price: 0.5678,
      change24h: 3.7,
      marketCap: 30000000000,
      volume24h: 2000000000,
    },
  ]
}

export async function GET() {
  try {
    const prices = await getCryptoPrices()
    return NextResponse.json(prices)
  } catch (error) {
    console.error("Error en la ruta de API de precios de criptomonedas:", error)
    return NextResponse.json({ error: "Error al obtener precios de criptomonedas" }, { status: 500 })
  }
}
