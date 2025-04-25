"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SensitiveValue } from "@/components/ui/sensitive-value"
import { ArrowDown, ArrowUp, Loader2 } from "lucide-react"

interface CryptoPrice {
  symbol: string
  name: string
  price: number
  change24h: number
  marketCap: number
  volume24h: number
}

export function CryptoPrices() {
  const [prices, setPrices] = useState<CryptoPrice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCryptoPrices() {
      try {
        setLoading(true)
        const response = await fetch("/api/crypto/prices")

        if (!response.ok) {
          throw new Error("Error al obtener precios de criptomonedas")
        }

        const data = await response.json()
        setPrices(data)
      } catch (err) {
        console.error("Error fetching crypto prices:", err)
        setError(err instanceof Error ? err.message : "Error desconocido")

        // Datos de ejemplo en caso de error
        setPrices([
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
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchCryptoPrices()

    // Actualizar cada 5 minutos
    const interval = setInterval(fetchCryptoPrices, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-500">
        <p>Error al cargar los precios: {error}</p>
        <p className="text-sm text-muted-foreground mt-2">Mostrando datos de ejemplo</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {prices.map((crypto) => (
        <Card key={crypto.symbol}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>{crypto.name}</CardTitle>
              <span className="text-sm font-medium">{crypto.symbol}</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <SensitiveValue
                value={crypto.price}
                formatter={(value) =>
                  `$${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                }
              />
            </div>
            <div className="flex justify-between items-center mt-2">
              <div className={`flex items-center ${crypto.change24h >= 0 ? "text-green-500" : "text-red-500"}`}>
                {crypto.change24h >= 0 ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
                <span>{Math.abs(crypto.change24h).toFixed(2)}%</span>
              </div>
              <div className="text-xs text-muted-foreground">24h</div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div>
                <p className="text-xs text-muted-foreground">Cap. de Mercado</p>
                <p className="text-sm font-medium">
                  <SensitiveValue
                    value={crypto.marketCap}
                    formatter={(value) => `$${(Number(value) / 1e9).toFixed(2)}B`}
                  />
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Vol. 24h</p>
                <p className="text-sm font-medium">
                  <SensitiveValue
                    value={crypto.volume24h}
                    formatter={(value) => `$${(Number(value) / 1e9).toFixed(2)}B`}
                  />
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
