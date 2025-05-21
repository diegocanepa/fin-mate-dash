"use client"

import { useState, useEffect, Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CurrencyExchangeRates } from "@/components/dashboard/currency-exchange-rates"
import { DollarExchangeChart } from "@/components/charts/dollar-exchange-chart"
import { getForex, getForexByMonth, type Forex } from "@/lib/db"
import { ErrorMessage } from "@/components/ui/error-message"
import { EmptyState } from "@/components/ui/empty-state"
import { FilterableExchangeTable } from "@/components/tables/filterable-exchange-table"
import { MonthYearSelector } from "@/components/month-year-selector"
import { SensitiveValue } from "@/components/ui/sensitive-value"

/**
 * Calcula el total de USD cambiados
 */
function calcularTotalUSDCambiados(cambios: Forex[]) {
  return cambios.filter((c) => c.currency_from === "USD").reduce((sum, c) => sum + c.amount, 0)
}

/**
 * Calcula el total de ARS recibidos
 */
function calcularTotalARSRecibidos(cambios: Forex[]) {
  return cambios.filter((c) => c.currency_to === "ARS").reduce((sum, c) => sum + c.amount * c.price, 0)
}

/**
 * Calcula el tipo de cambio promedio
 */
function calcularTipoCambioPromedio(cambios: Forex[]) {
  const cambiosUsdArs = cambios.filter((c) => c.currency_from === "USD" && c.currency_to === "ARS")
  if (cambiosUsdArs.length === 0) return 0

  return cambiosUsdArs.reduce((sum, c) => sum + c.price, 0) / cambiosUsdArs.length
}

/**
 * Calcula el promedio de dólares cambiados por mes
 */
function calcularPromedioDolaresMensual(historicalData: Array<{ month: number; year: number; cambios: Forex[] }>) {
  if (historicalData.length === 0) return 0

  const totalDolares = historicalData.reduce((sum, monthData) => {
    const dolaresMes = monthData.cambios
      .filter((c) => c.currency_from === "USD")
      .reduce((monthSum, c) => monthSum + c.amount, 0)
    return sum + dolaresMes
  }, 0)

  return totalDolares / historicalData.length
}

/**
 * Calcula el cambio porcentual entre dos valores
 */
function calcularCambioPorcentual(valorActual: number, valorAnterior: number) {
  if (valorAnterior === 0) return 0
  return ((valorActual - valorAnterior) / valorAnterior) * 100
}

/**
 * Obtiene los datos históricos de los últimos 5 meses
 */
async function obtenerDatosHistoricos(currentYear: number, currentMonth: number) {
  const historicalData = []

  for (let i = 0; i < 5; i++) {
    let targetMonth = currentMonth - i
    let targetYear = currentYear

    while (targetMonth <= 0) {
      targetMonth += 12
      targetYear -= 1
    }

    const cambiosMes = await getForexByMonth(targetYear, targetMonth)

    historicalData.push({
      month: targetMonth,
      year: targetYear,
      cambios: cambiosMes,
    })
  }

  return historicalData
}

export default function CambioDivisasPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [cambiosActuales, setCambiosActuales] = useState<Forex[]>([])
  const [cambiosAnteriores, setCambiosAnteriores] = useState<Forex[]>([])
  const [todosLosCambios, setTodosLosCambios] = useState<Forex[]>([])
  const [historicalData, setHistoricalData] = useState<Array<{ month: number; year: number; cambios: Forex[] }>>([])
  const [error, setError] = useState<Error | null>(null)
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1)

  // Función para cargar datos según el mes y año seleccionados
  const loadData = async (year: number, month: number) => {
    setIsLoading(true)
    try {
      // Obtener cambios del mes seleccionado
      const cambiosActualesData = await getForexByMonth(year, month)
      setCambiosActuales(cambiosActualesData)

      // Obtener cambios del mes anterior para comparar
      let lastMonth = month - 1
      let lastMonthYear = year
      if (lastMonth === 0) {
        lastMonth = 12
        lastMonthYear = year - 1
      }

      const cambiosAnterioresData = await getForexByMonth(lastMonthYear, lastMonth)
      setCambiosAnteriores(cambiosAnterioresData)

      // Obtener todos los cambios
      const todosLosCambiosData = await getForex()
      setTodosLosCambios(todosLosCambiosData)

      // Obtener datos históricos de los últimos 5 meses
      const historicalDataResult = await obtenerDatosHistoricos(year, month)
      setHistoricalData(historicalDataResult)
    } catch (err) {
      console.error("Error en la página de cambio de divisas:", err)
      setError(err instanceof Error ? err : new Error("Error desconocido al cargar datos"))
    } finally {
      setIsLoading(false)
    }
  }

  // Manejar cambio de mes/año
  const handleMonthYearChange = (year: number, month: number) => {
    setSelectedYear(year)
    setSelectedMonth(month)
  }

  // Cargar datos cuando cambia el mes/año seleccionado
  useEffect(() => {
    loadData(selectedYear, selectedMonth)
  }, [selectedYear, selectedMonth])

  // Verificar si hay cambios
  const hayCambios = todosLosCambios.length > 0

  // Verificar si hay cambios en el periodo actual
  const hayCambiosEnPeriodo = cambiosActuales.length > 0

  // Calcular métricas actuales
  const totalUSDCambiados = calcularTotalUSDCambiados(cambiosActuales)
  const totalARSRecibidos = calcularTotalARSRecibidos(cambiosActuales)
  const tipoCambioPromedio = calcularTipoCambioPromedio(cambiosActuales)
  const promedioDolaresMensual = calcularPromedioDolaresMensual(historicalData)

  // Calcular métricas del mes anterior (para comparación)
  const totalUSDCambiadosAnterior = calcularTotalUSDCambiados(cambiosAnteriores)
  const totalARSRecibidosAnterior = calcularTotalARSRecibidos(cambiosAnteriores)
  const tipoCambioPromedioAnterior = calcularTipoCambioPromedio(cambiosAnteriores)

  // Calcular cambios porcentuales
  const cambioUSD = calcularCambioPorcentual(totalUSDCambiados, totalUSDCambiadosAnterior)
  const cambioARS = calcularCambioPorcentual(totalARSRecibidos, totalARSRecibidosAnterior)
  const cambioTipoCambio = calcularCambioPorcentual(tipoCambioPromedio, tipoCambioPromedioAnterior)

  // Preparar datos para los gráficos
  const exchangeRateChartData = historicalData
    .map((monthData) => {
      const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
      const monthName = monthNames[monthData.month - 1]
      const yearShort = monthData.year.toString().slice(2)
      const label = `${monthName}/${yearShort}`

      const tipoCambio = calcularTipoCambioPromedio(monthData.cambios)

      return {
        date: label,
        rate: tipoCambio,
      }
    })
    .reverse()

  const dollarExchangeChartData = historicalData
    .map((monthData) => {
      const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
      const monthName = monthNames[monthData.month - 1]
      const yearShort = monthData.year.toString().slice(2)
      const label = `${monthName}/${yearShort}`

      const dolaresCambiados = calcularTotalUSDCambiados(monthData.cambios)

      return {
        date: label,
        amount: dolaresCambiados,
      }
    })
    .reverse()

  if (error) {
    return (
      <div className="flex flex-col">
        <div className="flex items-center justify-between space-y-2 py-4">
          <h2 className="text-3xl font-bold tracking-tight">Cambio de Divisas</h2>
        </div>
        <ErrorMessage
          title="Error al cargar los datos"
          description={`Ha ocurrido un error al cargar los datos de cambio de divisas: ${error.message}`}
          retry={() => loadData(selectedYear, selectedMonth)}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0 py-4">
        <h2 className="text-3xl font-bold tracking-tight">Cambio de Divisas</h2>
        <div className="flex items-center space-x-2">
          <MonthYearSelector
            onMonthYearChange={handleMonthYearChange}
            initialYear={selectedYear}
            initialMonth={selectedMonth}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <Tabs defaultValue="resumen" className="space-y-4">
          <TabsList className="flex flex-wrap">
            <TabsTrigger value="resumen">Resumen</TabsTrigger>
            <TabsTrigger value="historial">Historial</TabsTrigger>
          </TabsList>
          <TabsContent value="resumen" className="space-y-4">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">USD Cambiados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    <SensitiveValue
                      value={totalUSDCambiados}
                      formatter={(value) => `$${Number(value).toLocaleString()}`}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {cambioUSD >= 0 ? "+" : ""}
                    {cambioUSD.toFixed(1)}% desde el mes pasado
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">ARS Recibidos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    <SensitiveValue
                      value={totalARSRecibidos}
                      formatter={(value) => `$${Number(value).toLocaleString()}`}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {cambioARS >= 0 ? "+" : ""}
                    {cambioARS.toFixed(1)}% desde el mes pasado
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tipo de Cambio Promedio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    <SensitiveValue value={tipoCambioPromedio} formatter={(value) => Number(value).toLocaleString()} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {cambioTipoCambio >= 0 ? "+" : ""}
                    {cambioTipoCambio.toFixed(1)}% desde el mes pasado
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Promedio USD Mensual</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    <SensitiveValue
                      value={promedioDolaresMensual}
                      formatter={(value) => `$${Number(value).toFixed(2)}`}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Promedio de USD cambiados por mes</p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-7 lg:col-span-4">
                <CardHeader>
                  <CardTitle>Evolución del Tipo de Cambio</CardTitle>
                  <CardDescription>Tipo de cambio USD/ARS a lo largo del tiempo</CardDescription>
                </CardHeader>
                <CardContent>
                  {exchangeRateChartData.length > 0 ? (
                    <Suspense fallback={<div>Cargando gráfico...</div>}>
                      <CurrencyExchangeRates data={exchangeRateChartData} />
                    </Suspense>
                  ) : (
                    <EmptyState
                      title="No hay datos para mostrar"
                      description="No hay operaciones de cambio de divisas registradas."
                    />
                  )}
                </CardContent>
              </Card>
              <Card className="col-span-7 lg:col-span-3">
                <CardHeader>
                  <CardTitle>Dólares Cambiados por Mes</CardTitle>
                  <CardDescription>Cantidad de USD cambiados en los últimos meses</CardDescription>
                </CardHeader>
                <CardContent>
                  {dollarExchangeChartData.length > 0 ? (
                    <Suspense fallback={<div>Cargando gráfico...</div>}>
                      <DollarExchangeChart data={dollarExchangeChartData} />
                    </Suspense>
                  ) : (
                    <EmptyState
                      title="No hay datos para mostrar"
                      description="No hay operaciones de cambio de divisas registradas."
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="historial" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Historial de Cambios de Divisas</CardTitle>
                <CardDescription>Registro de todas las operaciones de cambio de USD realizadas</CardDescription>
              </CardHeader>
              <CardContent>
                {hayCambios ? (
                  <Suspense fallback={<div>Cargando tabla...</div>}>
                    <FilterableExchangeTable data={todosLosCambios} showDateFilter={false} />
                  </Suspense>
                ) : (
                  <EmptyState
                    title="No hay operaciones registradas"
                    description="No hay operaciones de cambio de divisas registradas."
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
