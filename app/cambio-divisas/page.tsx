import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CurrencyExchangeRates } from "@/components/dashboard/currency-exchange-rates"
import { getForex, getForexByMonth, type Forex } from "@/lib/db"
import { ErrorMessage } from "@/components/ui/error-message"
import { EmptyState } from "@/components/ui/empty-state"
import { PeriodEmptyState } from "@/components/ui/period-empty-state"
import { FilterableExchangeTable } from "@/components/tables/filterable-exchange-table"
import { MonthSelector } from "@/components/month-selector"

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
function calcularPromedioDolaresMensual(cambios: Forex[]) {
  // Agrupar por mes
  const cambiosPorMes = cambios.reduce(
    (acc, cambio) => {
      const fecha = new Date(cambio.date)
      const mesAno = `${fecha.getMonth() + 1}/${fecha.getFullYear()}`

      if (!acc[mesAno]) {
        acc[mesAno] = {
          total: 0,
          count: 0,
        }
      }

      if (cambio.currency_from === "USD") {
        acc[mesAno].total += cambio.amount
        acc[mesAno].count += 1
      }

      return acc
    },
    {} as Record<string, { total: number; count: number }>,
  )

  // Calcular el promedio por mes
  const meses = Object.keys(cambiosPorMes)
  if (meses.length === 0) return 0

  const totalDolares = Object.values(cambiosPorMes).reduce((sum, mes) => sum + mes.total, 0)
  return totalDolares / meses.length
}

/**
 * Calcula el cambio porcentual entre dos valores
 */
function calcularCambioPorcentual(valorActual: number, valorAnterior: number) {
  if (valorAnterior === 0) return 0
  return ((valorActual - valorAnterior) / valorAnterior) * 100
}

export default async function CambioDivisasPage() {
  try {
    // Obtener el mes y año actual para filtrar
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth() + 1

    // Obtener cambios del mes actual
    const cambiosActuales = await getForexByMonth(currentYear, currentMonth)

    // Obtener cambios del mes anterior para comparar
    const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1
    const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear
    const cambiosAnteriores = await getForexByMonth(lastMonthYear, lastMonth)

    // Obtener todos los cambios para el cálculo del promedio mensual
    const todosLosCambios = await getForex()

    // Verificar si hay cambios
    const hayCambios = todosLosCambios.length > 0

    // Verificar si hay cambios en el periodo actual
    const hayCambiosEnPeriodo = cambiosActuales.length > 0

    // Calcular métricas actuales
    const totalUSDCambiados = calcularTotalUSDCambiados(cambiosActuales)
    const totalARSRecibidos = calcularTotalARSRecibidos(cambiosActuales)
    const tipoCambioPromedio = calcularTipoCambioPromedio(cambiosActuales)
    const promedioDolaresMensual = calcularPromedioDolaresMensual(todosLosCambios)

    // Calcular métricas del mes anterior (para comparación)
    const totalUSDCambiadosAnterior = calcularTotalUSDCambiados(cambiosAnteriores)
    const totalARSRecibidosAnterior = calcularTotalARSRecibidos(cambiosAnteriores)
    const tipoCambioPromedioAnterior = calcularTipoCambioPromedio(cambiosAnteriores)

    // Calcular cambios porcentuales
    const cambioUSD = calcularCambioPorcentual(totalUSDCambiados, totalUSDCambiadosAnterior)
    const cambioARS = calcularCambioPorcentual(totalARSRecibidos, totalARSRecibidosAnterior)
    const cambioTipoCambio = calcularCambioPorcentual(tipoCambioPromedio, tipoCambioPromedioAnterior)

    return (
      <div className="flex flex-col">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0 py-4">
          <h2 className="text-3xl font-bold tracking-tight">Cambio de Divisas</h2>
          <div className="flex items-center space-x-2">
            <MonthSelector />
          </div>
        </div>
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
                  <div className="text-2xl font-bold">${totalUSDCambiados.toLocaleString()}</div>
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
                  <div className="text-2xl font-bold">${totalARSRecibidos.toLocaleString()}</div>
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
                  <div className="text-2xl font-bold">{tipoCambioPromedio.toLocaleString()}</div>
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
                  <div className="text-2xl font-bold">${promedioDolaresMensual.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">Promedio de USD cambiados por mes</p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-7">
                <CardHeader>
                  <CardTitle>Evolución del Tipo de Cambio</CardTitle>
                  <CardDescription>Tipo de cambio USD/ARS a lo largo del tiempo</CardDescription>
                </CardHeader>
                <CardContent>
                  {hayCambios ? (
                    hayCambiosEnPeriodo ? (
                      <Suspense fallback={<div>Cargando gráfico...</div>}>
                        <CurrencyExchangeRates data={cambiosActuales} />
                      </Suspense>
                    ) : (
                      <PeriodEmptyState
                        title="No hay datos en el período seleccionado"
                        description="No se encontraron operaciones de cambio de divisas en el período de tiempo seleccionado. Prueba con otro rango de fechas."
                      />
                    )
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
                    <FilterableExchangeTable data={todosLosCambios} />
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
      </div>
    )
  } catch (error) {
    console.error("Error en la página de cambio de divisas:", error)
    return (
      <div className="flex flex-col">
        <div className="flex items-center justify-between space-y-2 py-4">
          <h2 className="text-3xl font-bold tracking-tight">Cambio de Divisas</h2>
        </div>
        <ErrorMessage
          title="Error al cargar los datos"
          description="Ha ocurrido un error al cargar los datos de cambio de divisas. Por favor, intenta nuevamente más tarde."
          retry={() => window.location.reload()}
        />
      </div>
    )
  }
}

