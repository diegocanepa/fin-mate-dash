import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DateRangePicker } from "@/components/date-range-picker"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CurrencyExchangeRates } from "@/components/dashboard/currency-exchange-rates"
import { ExchangeHistoryTable } from "@/components/tables/exchange-history-table"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
// Importar funciones de la base de datos
// import { getCambiosDivisas, getCambiosDivisasByMonth, type CambioDivisas } from "@/lib/db"

// Datos de ejemplo - en producción vendrían de la API
const cambiosData = [
  {
    id: 1,
    fecha: "2023-08-15",
    accion: "Venta",
    cantidad: 500,
    moneda_origen: "USD",
    moneda_destino: "ARS",
    precio_cambio: 1150,
    total: 575000,
    descripcion: "Cambio en cueva",
  },
  {
    id: 2,
    fecha: "2023-08-01",
    accion: "Venta",
    cantidad: 300,
    moneda_origen: "USD",
    moneda_destino: "ARS",
    precio_cambio: 1100,
    total: 330000,
    descripcion: "Cambio en banco",
  },
  {
    id: 3,
    fecha: "2023-07-20",
    accion: "Venta",
    cantidad: 200,
    moneda_origen: "USD",
    moneda_destino: "ARS",
    precio_cambio: 1050,
    total: 210000,
    descripcion: "Cambio en cueva",
  },
  {
    id: 4,
    fecha: "2023-07-05",
    accion: "Venta",
    cantidad: 400,
    moneda_origen: "USD",
    moneda_destino: "ARS",
    precio_cambio: 1020,
    total: 408000,
    descripcion: "Cambio en cueva",
  },
  {
    id: 5,
    fecha: "2023-06-25",
    accion: "Venta",
    cantidad: 600,
    moneda_origen: "USD",
    moneda_destino: "ARS",
    precio_cambio: 980,
    total: 588000,
    descripcion: "Cambio en banco",
  },
]

/**
 * Calcula el total de USD cambiados
 */
function calcularTotalUSDCambiados(cambios: typeof cambiosData) {
  return cambios.filter((c) => c.moneda_origen === "USD").reduce((sum, c) => sum + c.cantidad, 0)
}

/**
 * Calcula el total de ARS recibidos
 */
function calcularTotalARSRecibidos(cambios: typeof cambiosData) {
  return cambios.filter((c) => c.moneda_destino === "ARS").reduce((sum, c) => sum + c.total, 0)
}

/**
 * Calcula el tipo de cambio promedio
 */
function calcularTipoCambioPromedio(cambios: typeof cambiosData) {
  if (cambios.length === 0) return 0

  return cambios.reduce((sum, c) => sum + c.precio_cambio, 0) / cambios.length
}

/**
 * Calcula el promedio de dólares cambiados por mes
 */
function calcularPromedioDolaresMensual(cambios: typeof cambiosData) {
  // Agrupar por mes
  const cambiosPorMes = cambios.reduce(
    (acc, cambio) => {
      const fecha = new Date(cambio.fecha)
      const mesAno = `${fecha.getMonth() + 1}/${fecha.getFullYear()}`

      if (!acc[mesAno]) {
        acc[mesAno] = {
          total: 0,
          count: 0,
        }
      }

      acc[mesAno].total += cambio.cantidad
      acc[mesAno].count += 1

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

export default function CambioDivisasPage() {
  // Código comentado para obtener datos reales de la base de datos
  /*
  async function getData() {
    // Obtener el mes y año actual para filtrar
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    
    // Obtener cambios del mes actual
    const cambiosActuales = await getCambiosDivisasByMonth(currentYear, currentMonth);
    
    // Obtener cambios del mes anterior para comparar
    const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;
    const cambiosAnteriores = await getCambiosDivisasByMonth(lastMonthYear, lastMonth);
    
    // Obtener todos los cambios para el cálculo del promedio mensual
    const todosLosCambios = await getCambiosDivisas();
    
    return {
      cambiosActuales,
      cambiosAnteriores,
      todosLosCambios
    };
  }
  
  const { cambiosActuales, cambiosAnteriores, todosLosCambios } = await getData();
  */

  // Usar datos de ejemplo mientras tanto
  const cambiosActuales = cambiosData
  const cambiosAnteriores: typeof cambiosData = []
  const todosLosCambios = cambiosData

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
      <div className="flex items-center justify-between space-y-2 py-4">
        <h2 className="text-3xl font-bold tracking-tight">Cambio de Divisas</h2>
        <div className="flex items-center space-x-2">
          <DateRangePicker />
          <Link href="/agregar">
            <Button className="ml-4">
              <PlusCircle className="mr-2 h-4 w-4" />
              Agregar
            </Button>
          </Link>
        </div>
      </div>
      <Tabs defaultValue="resumen" className="space-y-4">
        <TabsList>
          <TabsTrigger value="resumen">Resumen</TabsTrigger>
          <TabsTrigger value="historial">Historial</TabsTrigger>
        </TabsList>
        <TabsContent value="resumen" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
                <Suspense fallback={<div>Cargando gráfico...</div>}>
                  <CurrencyExchangeRates />
                </Suspense>
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
              <Suspense fallback={<div>Cargando tabla...</div>}>
                <ExchangeHistoryTable data={todosLosCambios} />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

