import { NextResponse } from "next/server"
import { BYMA_CONFIG } from "@/lib/byma-data"

// Función para obtener datos de BymaData
async function fetchBymaData(url: string) {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Error al obtener datos: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Error al hacer fetch a ${url}:`, error)
    throw error
  }
}

// Función para obtener datos de acciones argentinas
async function getAccionesArgentinas() {
  try {
    // URL real de la API de BymaData para acciones
    const url = "https://open.bymadata.com.ar/vanoms-be-core/rest/api/bymadata/free/bnown/listado-especies"
    const data = await fetchBymaData(url)

    // Filtrar solo las acciones que nos interesan
    const acciones = data.data
      .filter((item: any) => BYMA_CONFIG.ACCIONES_ARG.includes(item.simbolo))
      .map((item: any) => ({
        symbol: item.simbolo,
        name: BYMA_CONFIG.SYMBOL_NAMES[item.simbolo] || item.descripcion,
        price: Number.parseFloat(item.ultimoPrecio) || 0,
        change: Number.parseFloat(item.variacionPorcentual) || 0,
        volume: Number.parseInt(item.volumenNominal) || 0,
        timestamp: new Date().toISOString(),
        type: "accion_arg",
      }))

    return acciones
  } catch (error) {
    console.error("Error al obtener acciones argentinas:", error)
    // Devolvemos datos de ejemplo en caso de error
    return BYMA_CONFIG.ACCIONES_ARG.map((symbol) => ({
      symbol,
      name: BYMA_CONFIG.SYMBOL_NAMES[symbol] || symbol,
      price: getRandomPrice(500, 5000),
      change: getRandomChange(-5, 5),
      volume: getRandomVolume(100000, 10000000),
      timestamp: new Date().toISOString(),
      type: "accion_arg",
    }))
  }
}

// Función para obtener datos de CEDEARs
async function getCedears() {
  try {
    // URL real de la API de BymaData para CEDEARs
    const url = "https://open.bymadata.com.ar/vanoms-be-core/rest/api/bymadata/free/cedears/listado-cedears"
    const data = await fetchBymaData(url)

    // Filtrar solo los CEDEARs que nos interesan
    const cedears = data.data
      .filter((item: any) => BYMA_CONFIG.ACCIONES_CEDEARS.includes(item.simbolo.replace("D", "")))
      .map((item: any) => ({
        symbol: item.simbolo,
        name: BYMA_CONFIG.SYMBOL_NAMES[item.simbolo.replace("D", "")] || item.descripcion,
        price: Number.parseFloat(item.ultimoPrecio) || 0,
        change: Number.parseFloat(item.variacionPorcentual) || 0,
        volume: Number.parseInt(item.volumenNominal) || 0,
        timestamp: new Date().toISOString(),
        type: "cedear",
      }))

    return cedears
  } catch (error) {
    console.error("Error al obtener CEDEARs:", error)
    // Devolvemos datos de ejemplo en caso de error
    return BYMA_CONFIG.ACCIONES_CEDEARS.map((symbol) => ({
      symbol: symbol + "D",
      name: BYMA_CONFIG.SYMBOL_NAMES[symbol] || `${symbol} CEDEAR`,
      price: getRandomPrice(5000, 50000),
      change: getRandomChange(-5, 5),
      volume: getRandomVolume(100000, 10000000),
      timestamp: new Date().toISOString(),
      type: "cedear",
    }))
  }
}

// Función para obtener datos de bonos
async function getBonos() {
  try {
    // URL real de la API de BymaData para bonos
    const url = "https://open.bymadata.com.ar/vanoms-be-core/rest/api/bymadata/free/gobierno/bonos-gobierno"
    const data = await fetchBymaData(url)

    // Filtrar solo los bonos que nos interesan
    const bonos = data.data
      .filter((item: any) => {
        const baseSymbol = item.simbolo.replace("D", "")
        return BYMA_CONFIG.BONOS.includes(baseSymbol)
      })
      .map((item: any) => ({
        symbol: item.simbolo,
        name: BYMA_CONFIG.SYMBOL_NAMES[item.simbolo.replace("D", "")] || item.descripcion,
        price: Number.parseFloat(item.ultimoPrecio) || 0,
        change: Number.parseFloat(item.variacionPorcentual) || 0,
        volume: Number.parseInt(item.volumenNominal) || 0,
        timestamp: new Date().toISOString(),
        type: "bono",
      }))

    return bonos
  } catch (error) {
    console.error("Error al obtener bonos:", error)
    // Devolvemos datos de ejemplo en caso de error
    return BYMA_CONFIG.BONOS.map((symbol) => ({
      symbol: symbol + "D",
      name: BYMA_CONFIG.SYMBOL_NAMES[symbol] || `Bono ${symbol}`,
      price: getRandomPrice(30, 60),
      change: getRandomChange(-2, 2),
      volume: getRandomVolume(1000000, 50000000),
      timestamp: new Date().toISOString(),
      type: "bono",
    }))
  }
}

// Función para obtener datos de índices
async function getIndices() {
  try {
    // Para índices internacionales, podríamos usar otra fuente o datos de ejemplo
    return BYMA_CONFIG.INDICES.map((symbol) => ({
      symbol,
      name: BYMA_CONFIG.SYMBOL_NAMES[symbol] || symbol,
      price: getRandomPrice(3000, 18000),
      change: getRandomChange(-2, 2),
      volume: getRandomVolume(10000000, 100000000),
      timestamp: new Date().toISOString(),
      type: "indice",
    }))
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
