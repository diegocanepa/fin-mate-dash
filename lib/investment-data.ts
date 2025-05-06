// Tipos de datos para inversiones
export type InvestmentAction = "buy" | "sell"
export type InvestmentCategory = "acciones" | "cedear" | "bono" | "criptomonedas"
export type Currency = "ARS" | "USD" | "USDT" | "BTC" | "ETH"

export interface Investment {
  id: string
  date: string
  action: InvestmentAction
  category: InvestmentCategory
  symbol: string
  platform: string
  amount: number
  unitPrice: number
  currency: Currency
  description: string
}

// Datos mock de inversiones
export const mockInvestments: Investment[] = [
  {
    id: "1",
    date: "2023-01-15",
    action: "buy",
    category: "acciones",
    symbol: "GGAL",
    platform: "IOL",
    amount: 100,
    unitPrice: 250.5,
    currency: "ARS",
    description: "Compra de acciones de Grupo Financiero Galicia",
  },
  {
    id: "2",
    date: "2023-02-10",
    action: "buy",
    category: "cedear",
    symbol: "MELI",
    platform: "PPI",
    amount: 5,
    unitPrice: 15000,
    currency: "ARS",
    description: "Compra de CEDEAR de MercadoLibre",
  },
  {
    id: "3",
    date: "2023-03-05",
    action: "buy",
    category: "criptomonedas",
    symbol: "BTC",
    platform: "Binance",
    amount: 0.05,
    unitPrice: 28000,
    currency: "USD",
    description: "Compra de Bitcoin",
  },
  {
    id: "4",
    date: "2023-04-20",
    action: "buy",
    category: "bono",
    symbol: "AL30",
    platform: "IOL",
    amount: 10000,
    unitPrice: 0.35,
    currency: "USD",
    description: "Compra de Bono AL30",
  },
  {
    id: "5",
    date: "2023-05-12",
    action: "buy",
    category: "criptomonedas",
    symbol: "ETH",
    platform: "Lemon",
    amount: 1.2,
    unitPrice: 1800,
    currency: "USD",
    description: "Compra de Ethereum",
  },
  {
    id: "6",
    date: "2023-06-18",
    action: "sell",
    category: "acciones",
    symbol: "GGAL",
    platform: "IOL",
    amount: 50,
    unitPrice: 320.75,
    currency: "ARS",
    description: "Venta parcial de acciones de Grupo Financiero Galicia",
  },
  {
    id: "7",
    date: "2023-07-25",
    action: "buy",
    category: "cedear",
    symbol: "AAPL",
    platform: "PPI",
    amount: 10,
    unitPrice: 8500,
    currency: "ARS",
    description: "Compra de CEDEAR de Apple",
  },
  {
    id: "8",
    date: "2023-08-30",
    action: "buy",
    category: "criptomonedas",
    symbol: "SOL",
    platform: "Binance",
    amount: 15,
    unitPrice: 25,
    currency: "USD",
    description: "Compra de Solana",
  },
  {
    id: "9",
    date: "2023-09-15",
    action: "sell",
    category: "criptomonedas",
    symbol: "BTC",
    platform: "Binance",
    amount: 0.02,
    unitPrice: 35000,
    currency: "USD",
    description: "Venta parcial de Bitcoin",
  },
  {
    id: "10",
    date: "2023-10-05",
    action: "buy",
    category: "acciones",
    symbol: "YPF",
    platform: "IOL",
    amount: 200,
    unitPrice: 4500,
    currency: "ARS",
    description: "Compra de acciones de YPF",
  },
  {
    id: "11",
    date: "2023-11-12",
    action: "sell",
    category: "cedear",
    symbol: "MELI",
    platform: "PPI",
    amount: 2,
    unitPrice: 22000,
    currency: "ARS",
    description: "Venta parcial de CEDEAR de MercadoLibre",
  },
  {
    id: "12",
    date: "2023-12-20",
    action: "buy",
    category: "bono",
    symbol: "GD30",
    platform: "IOL",
    amount: 5000,
    unitPrice: 0.42,
    currency: "USD",
    description: "Compra de Bono GD30",
  },
  // Añadimos una segunda compra de GGAL para demostrar el precio promedio
  {
    id: "13",
    date: "2023-12-28",
    action: "buy",
    category: "acciones",
    symbol: "GGAL",
    platform: "IOL",
    amount: 150,
    unitPrice: 310.25,
    currency: "ARS",
    description: "Segunda compra de acciones de Grupo Financiero Galicia",
  },
  // Añadimos una segunda compra de BTC para demostrar el precio promedio
  {
    id: "14",
    date: "2024-01-10",
    action: "buy",
    category: "criptomonedas",
    symbol: "BTC",
    platform: "Binance",
    amount: 0.03,
    unitPrice: 38000,
    currency: "USD",
    description: "Segunda compra de Bitcoin",
  },
  // Añadimos YPFD para demostrar la API
  {
    id: "15",
    date: "2024-02-15",
    action: "buy",
    category: "acciones",
    symbol: "YPFD",
    platform: "IOL",
    amount: 50,
    unitPrice: 8000,
    currency: "ARS",
    description: "Compra de acciones de YPF",
  },
  // Añadimos TSLA para demostrar la API
  {
    id: "16",
    date: "2024-02-20",
    action: "buy",
    category: "cedear",
    symbol: "TSLA",
    platform: "PPI",
    amount: 2,
    unitPrice: 12000,
    currency: "ARS",
    description: "Compra de CEDEAR de Tesla",
  },
]

// Precios actuales simulados para calcular el valor actual
export const currentPrices: Record<string, { price: number; currency: Currency }> = {
  GGAL: { price: 380.25, currency: "ARS" },
  MELI: { price: 25000, currency: "ARS" },
  BTC: { price: 42000, currency: "USD" },
  ETH: { price: 2200, currency: "USD" },
  AL30: { price: 0.48, currency: "USD" },
  AAPL: { price: 9800, currency: "ARS" },
  SOL: { price: 40, currency: "USD" },
  YPF: { price: 5200, currency: "ARS" },
  GD30: { price: 0.45, currency: "USD" },
  YPFD: { price: 8500, currency: "ARS" },
  TSLA: { price: 13000, currency: "ARS" },
}

// Tasas de cambio simuladas para conversiones
export const exchangeRates: Record<Currency, number> = {
  ARS: 1,
  USD: 900,
  USDT: 900,
  BTC: 42000 * 900, // Precio BTC en USD * tasa USD/ARS
  ETH: 2200 * 900, // Precio ETH en USD * tasa USD/ARS
}

// Función para obtener todos los símbolos únicos de las inversiones
export function getAllSymbols(): string[] {
  const symbols = new Set<string>()
  mockInvestments.forEach((inv) => {
    symbols.add(inv.symbol)
  })
  return Array.from(symbols)
}

// Función para obtener todos los símbolos únicos de las inversiones con sus tipos
export function getAllSymbolsWithTypes() {
  const activeInvestments = getActiveInvestments()

  const symbols: string[] = []
  const types: string[] = []

  activeInvestments.forEach((investment) => {
    // Evitar duplicados
    if (!symbols.includes(investment.symbol)) {
      symbols.push(investment.symbol)
      types.push(investment.category)
    }
  })

  return { symbols, types }
}

// Función para calcular inversiones activas (compras sin ventas correspondientes)
export function getActiveInvestments(): Array<
  Investment & {
    averagePrice: number
    totalInvested: number
    totalAmount: number
  }
> {
  // Crear un mapa para rastrear las cantidades por símbolo
  const balances: Record<
    string,
    {
      investment: Investment
      totalAmount: number
      totalInvested: number
      averagePrice: number
      buyOperations: number
    }
  > = {}

  // Ordenar inversiones por fecha
  const sortedInvestments = [...mockInvestments].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Procesar cada inversión
  sortedInvestments.forEach((inv) => {
    const key = `${inv.symbol}-${inv.platform}-${inv.currency}`

    if (!balances[key]) {
      balances[key] = {
        investment: { ...inv },
        totalAmount: 0,
        totalInvested: 0,
        averagePrice: 0,
        buyOperations: 0,
      }
    }

    if (inv.action === "buy") {
      balances[key].totalAmount += inv.amount
      balances[key].totalInvested += inv.amount * inv.unitPrice
      balances[key].buyOperations += 1
    } else if (inv.action === "sell") {
      balances[key].totalAmount -= inv.amount
      // No restamos el valor total invertido porque queremos mantener el precio promedio correcto
    }

    // Recalcular el precio promedio después de cada operación
    if (balances[key].totalAmount > 0) {
      balances[key].averagePrice = balances[key].totalInvested / balances[key].totalAmount
    }
  })

  // Filtrar solo las inversiones con cantidad restante positiva
  return Object.values(balances)
    .filter((item) => item.totalAmount > 0)
    .map((item) => ({
      ...item.investment,
      amount: item.totalAmount,
      unitPrice: item.averagePrice, // Usamos el precio promedio como precio unitario
      averagePrice: item.averagePrice,
      totalInvested: item.totalInvested,
      totalAmount: item.totalAmount,
    }))
}

// Función para calcular inversiones cerradas (ventas)
export function getClosedInvestments(): Array<{
  id: string
  symbol: string
  category: InvestmentCategory
  platform: string
  buyDate: string
  sellDate: string
  buyPrice: number
  sellPrice: number
  amount: number
  currency: Currency
  profit: number
  profitPercentage: number
}> {
  const closedInvestments: Array<{
    id: string
    symbol: string
    category: InvestmentCategory
    platform: string
    buyDate: string
    sellDate: string
    buyPrice: number
    sellPrice: number
    amount: number
    currency: Currency
    profit: number
    profitPercentage: number
  }> = []

  // Filtrar ventas
  const sells = mockInvestments.filter((inv) => inv.action === "sell")

  // Para cada venta, encontrar la compra correspondiente
  sells.forEach((sell) => {
    // Buscar compras del mismo símbolo y plataforma
    const buys = mockInvestments.filter(
      (inv) =>
        inv.action === "buy" &&
        inv.symbol === sell.symbol &&
        inv.platform === sell.platform &&
        inv.currency === sell.currency &&
        new Date(inv.date) < new Date(sell.date),
    )

    if (buys.length > 0) {
      // Simplificación: usar la primera compra encontrada
      const buy = buys[0]

      const profit = sell.amount * (sell.unitPrice - buy.unitPrice)
      const profitPercentage = ((sell.unitPrice - buy.unitPrice) / buy.unitPrice) * 100

      closedInvestments.push({
        id: `${buy.id}-${sell.id}`,
        symbol: sell.symbol,
        category: sell.category,
        platform: sell.platform,
        buyDate: buy.date,
        sellDate: sell.date,
        buyPrice: buy.unitPrice,
        sellPrice: sell.unitPrice,
        amount: sell.amount,
        currency: sell.currency,
        profit,
        profitPercentage,
      })
    }
  })

  return closedInvestments
}

// Función para calcular el valor actual de una inversión
export function getCurrentValue(investment: Investment, realTimePrice?: number): number {
  // Si tenemos un precio en tiempo real, lo usamos
  if (realTimePrice !== undefined) {
    return investment.amount * realTimePrice
  }

  // Si no, usamos el precio almacenado
  const currentPrice = currentPrices[investment.symbol]?.price || investment.unitPrice
  return investment.amount * currentPrice
}

// Función para calcular el capital invertido
export function getInvestedCapital(investments: Investment[]): number {
  return investments.reduce((total, inv) => {
    return total + inv.amount * inv.unitPrice
  }, 0)
}

// Función para calcular el valor actual total
export function getCurrentTotalValue(investments: Investment[], realTimePrices?: Record<string, number>): number {
  return investments.reduce((total, inv) => {
    const realTimePrice = realTimePrices ? realTimePrices[inv.symbol] : undefined
    return total + getCurrentValue(inv, realTimePrice)
  }, 0)
}

// Función para calcular la rentabilidad total
export function getTotalProfit(
  investments: Investment[],
  realTimePrices?: Record<string, number>,
): {
  value: number
  percentage: number
} {
  const investedCapital = getInvestedCapital(investments)
  const currentValue = getCurrentTotalValue(investments, realTimePrices)
  const profit = currentValue - investedCapital
  const percentage = investedCapital > 0 ? (profit / investedCapital) * 100 : 0

  return {
    value: profit,
    percentage,
  }
}

// Función para calcular la ganancia/pérdida realizada total
export function getRealizedProfit(): number {
  const closedInvestments = getClosedInvestments()
  return closedInvestments.reduce((total, inv) => {
    // Convertir a ARS si es necesario
    const profitInOriginalCurrency = inv.profit
    const rate = exchangeRates[inv.currency]
    return total + profitInOriginalCurrency * rate
  }, 0)
}

// Función para obtener datos para el gráfico de distribución
export function getDistributionData(realTimePrices?: Record<string, number>): Array<{
  name: string
  value: number
}> {
  const activeInvestments = getActiveInvestments()
  const categoryMap: Record<string, number> = {}

  activeInvestments.forEach((inv) => {
    if (!categoryMap[inv.category]) {
      categoryMap[inv.category] = 0
    }

    const realTimePrice = realTimePrices ? realTimePrices[inv.symbol] : undefined
    const currentValue = getCurrentValue(inv, realTimePrice)
    // Convertir a ARS si es necesario
    const valueInARS = currentValue * exchangeRates[inv.currency]
    categoryMap[inv.category] += valueInARS
  })

  return Object.entries(categoryMap).map(([name, value]) => ({
    name,
    value,
  }))
}

// Función para obtener datos para el gráfico de evolución
export function getPortfolioEvolutionData(): Array<{
  date: string
  value: number
}> {
  // Simulamos datos de evolución de cartera para los últimos 12 meses
  const today = new Date()
  const data: Array<{ date: string; value: number }> = []

  for (let i = 11; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1)
    const dateStr = date.toISOString().split("T")[0].substring(0, 7) // YYYY-MM

    // Valor base + variación aleatoria para simular crecimiento
    const baseValue = 1000000 // 1 millón ARS
    const growthFactor = 1 + (0.05 * (11 - i)) / 11 // Crecimiento gradual
    const randomVariation = 0.9 + Math.random() * 0.2 // Variación aleatoria entre 0.9 y 1.1

    data.push({
      date: dateStr,
      value: Math.round(baseValue * growthFactor * randomVariation),
    })
  }

  return data
}
