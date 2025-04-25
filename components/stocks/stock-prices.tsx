"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowDown, ArrowUp, Loader2 } from "lucide-react"
import { SensitiveValue } from "@/components/ui/sensitive-value"

// Definimos los tipos para los datos de cotizaciones
interface StockQuote {
  symbol: string
  name: string
  price: number
  change: number
  volume: number
  timestamp: string
  type: string
}

interface BymaData {
  acciones_arg: StockQuote[]
  cedears: StockQuote[]
  bonos: StockQuote[]
  indices: StockQuote[]
  timestamp: string
}

export function StockPrices() {
  const [data, setData] = useState<BymaData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Función para obtener los datos de cotizaciones
  const fetchStockData = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/stocks/byma-scraper")

      if (!response.ok) {
        throw new Error(`Error al obtener cotizaciones: ${response.statusText}`)
      }

      const stockData = await response.json()
      setData(stockData)
      setError(null)
    } catch (err) {
      console.error("Error al obtener cotizaciones:", err)
      setError(err instanceof Error ? err.message : "Error al cargar las cotizaciones")
    } finally {
      setLoading(false)
    }
  }

  // Efecto para cargar los datos al montar el componente y cada 5 minutos
  useEffect(() => {
    fetchStockData()

    // Actualizamos los datos cada 5 minutos
    const interval = setInterval(fetchStockData, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  // Si hay un error, mostramos un mensaje
  if (error) {
    return (
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-500">Error al cargar cotizaciones</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <button
            onClick={fetchStockData}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Reintentar
          </button>
        </CardContent>
      </Card>
    )
  }

  // Si está cargando, mostramos un indicador
  if (loading && !data) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Cargando cotizaciones...</span>
      </div>
    )
  }

  // Renderizamos las cotizaciones
  return (
    <Tabs defaultValue="acciones" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="acciones">Acciones Arg.</TabsTrigger>
        <TabsTrigger value="cedears">CEDEARs</TabsTrigger>
        <TabsTrigger value="bonos">Bonos</TabsTrigger>
        <TabsTrigger value="indices">Índices</TabsTrigger>
      </TabsList>

      <TabsContent value="acciones" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.acciones_arg && data.acciones_arg.length > 0 ? (
            data.acciones_arg.map((stock) => <StockCard key={stock.symbol} stock={stock} />)
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">No hay datos de acciones disponibles</p>
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="cedears" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.cedears && data.cedears.length > 0 ? (
            data.cedears.map((stock) => <StockCard key={stock.symbol} stock={stock} />)
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">No hay datos de CEDEARs disponibles</p>
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="bonos" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.bonos && data.bonos.length > 0 ? (
            data.bonos.map((stock) => <StockCard key={stock.symbol} stock={stock} />)
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">No hay datos de bonos disponibles</p>
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="indices" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.indices && data.indices.length > 0 ? (
            data.indices.map((stock) => <StockCard key={stock.symbol} stock={stock} />)
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">No hay datos de índices disponibles</p>
            </div>
          )}
        </div>
      </TabsContent>

      <div className="text-xs text-muted-foreground mt-4 text-right">
        Última actualización: {data?.timestamp ? new Date(data.timestamp).toLocaleString() : "N/A"}
      </div>
    </Tabs>
  )
}

// Componente para mostrar una tarjeta de cotización
function StockCard({ stock }: { stock: StockQuote }) {
  const isPositive = stock.change >= 0
  const changeColor = isPositive ? "text-green-500" : "text-red-500"
  const ArrowIcon = isPositive ? ArrowUp : ArrowDown

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{stock.symbol}</CardTitle>
            <CardDescription>{stock.name}</CardDescription>
          </div>
          <Badge variant={isPositive ? "success" : "destructive"} className="ml-2">
            {isPositive ? "+" : ""}
            {stock.change.toFixed(2)}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="text-2xl font-bold mb-1">
          <SensitiveValue>
            {stock.type === "bono" ? `${stock.price.toFixed(2)}%` : `$${stock.price.toFixed(2)}`}
          </SensitiveValue>
        </div>
        <div className={`flex items-center ${changeColor}`}>
          <ArrowIcon className="h-4 w-4 mr-1" />
          <SensitiveValue>
            {isPositive ? "+" : ""}
            {stock.change.toFixed(2)}%
          </SensitiveValue>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="w-full grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-muted-foreground">Volumen:</span>{" "}
            <SensitiveValue>{stock.volume.toLocaleString()}</SensitiveValue>
          </div>
          <div>
            <span className="text-muted-foreground">Tipo:</span>{" "}
            <span className="capitalize">{getTipoInstrumento(stock.type)}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

// Función para obtener el tipo de instrumento en español
function getTipoInstrumento(type: string): string {
  const tipos: Record<string, string> = {
    accion_arg: "Acción Argentina",
    cedear: "CEDEAR",
    bono: "Bono",
    indice: "Índice/ETF",
  }
  return tipos[type] || type
}
