import { NextResponse } from "next/server"
import { parse } from "node-html-parser"

// Definimos los símbolos que queremos consultar
const ACCIONES_ARG = ["GGAL", "LOMA", "PAMP"]
const ACCIONES_CEDEARS = ["AAPL", "MELI"]
const BONOS = ["AL30", "AL35"]
const INDICES = ["SPY", "QQQ"] // QQQ representa al NASDAQ

// Función para obtener el HTML de BymaData
async function fetchBymaData(url: string) {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    })

    if (!response.ok) {
      throw new Error(`Error al obtener datos: ${response.statusText}`)
    }

    return await response.text()
  } catch (error) {
    console.error(`Error al hacer fetch a ${url}:`, error)
    throw error
  }
}

// Función para extraer datos de acciones argentinas
async function getAccionesArgentinas() {
  try {
    const html = await fetchBymaData(
      "https://open.bymadata.com.ar/vanoms-be-core/rest/api/bymadata/free/bnown/listado-especies",
    )
    const root = parse(html)

    // Extraer datos de la tabla (esto es un ejemplo, la estructura exacta dependerá del HTML)
    const acciones = ACCIONES_ARG.map((symbol) => {
      // En un caso real, buscaríamos el símbolo en el HTML y extraeríamos los datos
      // Aquí usamos datos de ejemplo
      return {
        symbol,
        name: getAccionName(symbol),
        price: getRandomPrice(500, 5000),
        change: getRandomChange(-5, 5),
        volume: getRandomVolume(100000, 10000000),
        timestamp: new Date().toISOString(),
        type: "accion_arg",
      }
    })

    return acciones
  } catch (error) {
    console.error("Error al obtener acciones argentinas:", error)
    return []
  }
}

// Función para extraer datos de CEDEARs
async function getCedears() {
  try {
    const html = await fetchBymaData(
      "https://open.bymadata.com.ar/vanoms-be-core/rest/api/bymadata/free/cedears/listado-cedears",
    )
    const root = parse(html)

    // Extraer datos de la tabla
    const cedears = ACCIONES_CEDEARS.map((symbol) => {
      return {
        symbol: symbol + "D", // Añadimos D para indicar que es un CEDEAR
        name: getCedearName(symbol),
        price: getRandomPrice(5000, 50000),
        change: getRandomChange(-5, 5),
        volume: getRandomVolume(100000, 10000000),
        timestamp: new Date().toISOString(),
        type: "cedear",
      }
    })

    return cedears
  } catch (error) {
    console.error("Error al obtener CEDEARs:", error)
    return []
  }
}

// Función para extraer datos de bonos
async function getBonos() {
  try {
    const html = await fetchBymaData(
      "https://open.bymadata.com.ar/vanoms-be-core/rest/api/bymadata/free/gobierno/bonos-gobierno",
    )
    const root = parse(html)

    // Extraer datos de la tabla
    const bonos = BONOS.map((symbol) => {
      return {
        symbol: symbol + "D", // Añadimos D para indicar que es en dólares
        name: getBonoName(symbol),
        price: getRandomPrice(30, 60), // Los bonos suelen cotizar en porcentaje
        change: getRandomChange(-2, 2),
        volume: getRandomVolume(1000000, 50000000),
        timestamp: new Date().toISOString(),
        type: "bono",
      }
    })

    return bonos
  } catch (error) {
    console.error("Error al obtener bonos:", error)
    return []
  }
}

// Función para extraer datos de índices
async function getIndices() {
  try {
    // Para índices internacionales, podríamos usar otra fuente
    const indices = INDICES.map((symbol) => {
      return {
        symbol,
        name: getIndiceName(symbol),
        price: getRandomPrice(3000, 18000),
        change: getRandomChange(-2, 2),
        volume: getRandomVolume(10000000, 100000000),
        timestamp: new Date().toISOString(),
        type: "indice",
      }
    })

    return indices
  } catch (error) {
    console.error("Error al obtener índices:", error)
    return []
  }
}

// Funciones auxiliares para generar datos de ejemplo
function getRandomPrice(min: number, max: number) {
  return Number((Math.random() * (max - min) + min).toFixed(2))
}

function getRandomChange(min: number, max: number) {
  return Number((Math.random() * (max - min) + min).toFixed(2))
}

function getRandomVolume(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min)
}

function getAccionName(symbol: string) {
  const names: Record<string, string> = {
    GGAL: "Grupo Financiero Galicia",
    LOMA: "Loma Negra",
    PAMP: "Pampa Energía",
  }
  return names[symbol] || symbol
}

function getCedearName(symbol: string) {
  const names: Record<string, string> = {
    AAPL: "Apple Inc. CEDEAR",
    MELI: "MercadoLibre Inc. CEDEAR",
  }
  return names[symbol] || `${symbol} CEDEAR`
}

function getBonoName(symbol: string) {
  const names: Record<string, string> = {
    AL30: "Bono Argentino 2030 USD",
    AL35: "Bono Argentino 2035 USD",
  }
  return names[symbol] || `Bono ${symbol}`
}

function getIndiceName(symbol: string) {
  const names: Record<string, string> = {
    SPY: "S&P 500 ETF",
    QQQ: "NASDAQ-100 ETF",
  }
  return names[symbol] || symbol
}

export async function GET() {
  try {
    // Obtenemos datos de todas las fuentes en paralelo
    const [acciones, cedears, bonos, indices] = await Promise.all([
      getAccionesArgentinas(),
      getCedears(),
      getBonos(),
      getIndices(),
    ])

    // Combinamos todos los resultados
    return NextResponse.json({
      acciones_arg: acciones,
      cedears: cedears,
      bonos: bonos,
      indices: indices,
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
