import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MonthSelector } from "@/components/month-selector"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExpensesByCategory } from "@/components/dashboard/expenses-by-category"
import { TransactionsTable } from "@/components/tables/transactions-table"
import { IncomeVsExpensesChart } from "@/components/charts/income-vs-expenses-chart"
import { CategoryTransactions } from "@/components/category-transactions"
import { getTransactionsByMonth, type Transaction } from "@/lib/db"
import { ErrorMessage } from "@/components/ui/error-message"
import { EmptyState } from "@/components/ui/empty-state"

/**
 * Calcula el total de ingresos
 */
function calcularTotalIngresos(transacciones: Transaction[]) {
  return transacciones.filter((t) => t.action === "Ingreso").reduce((sum, t) => sum + t.amount, 0)
}

/**
 * Calcula el total de gastos
 */
function calcularTotalGastos(transacciones: Transaction[]) {
  return transacciones.filter((t) => t.action === "Gasto").reduce((sum, t) => sum + t.amount, 0)
}

/**
 * Calcula el balance (ingresos - gastos)
 */
function calcularBalance(transacciones: Transaction[]) {
  const ingresos = calcularTotalIngresos(transacciones)
  const gastos = calcularTotalGastos(transacciones)
  return ingresos - gastos
}

/**
 * Calcula el cambio porcentual entre dos valores
 */
function calcularCambioPorcentual(valorActual: number, valorAnterior: number) {
  if (valorAnterior === 0) return 0
  return ((valorActual - valorAnterior) / valorAnterior) * 100
}

export default async function GastosPage() {
  try {
    // Obtener el mes y año actual para filtrar
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth() + 1

    // Obtener transacciones del mes actual
    const transaccionesActuales = await getTransactionsByMonth(currentYear, currentMonth)

    // Obtener transacciones del mes anterior para comparar
    const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1
    const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear
    const transaccionesAnteriores = await getTransactionsByMonth(lastMonthYear, lastMonth)

    // Verificar si hay transacciones
    const hayTransacciones = transaccionesActuales.length > 0
    const hayGastos = transaccionesActuales.some((t) => t.action === "Gasto")
    const hayIngresos = transaccionesActuales.some((t) => t.action === "Ingreso")

    // Calcular métricas actuales
    const totalIngresos = calcularTotalIngresos(transaccionesActuales)
    const totalGastos = calcularTotalGastos(transaccionesActuales)
    const balance = calcularBalance(transaccionesActuales)

    // Calcular métricas del mes anterior (para comparación)
    const totalIngresosAnterior = calcularTotalIngresos(transaccionesAnteriores)
    const totalGastosAnterior = calcularTotalGastos(transaccionesAnteriores)
    const balanceAnterior = calcularBalance(transaccionesAnteriores)

    // Calcular cambios porcentuales
    const cambioIngresos = calcularCambioPorcentual(totalIngresos, totalIngresosAnterior)
    const cambioGastos = calcularCambioPorcentual(totalGastos, totalGastosAnterior)
    const cambioBalance = calcularCambioPorcentual(balance, balanceAnterior)

    return (
      <div className="flex flex-col">
        <div className="flex items-center justify-between space-y-2 py-4">
          <h2 className="text-3xl font-bold tracking-tight">Gastos e Ingresos</h2>
          <div className="flex items-center space-x-2">
            <MonthSelector />
          </div>
        </div>
        <Tabs defaultValue="resumen" className="space-y-4">
          <TabsList className="flex flex-wrap">
            <TabsTrigger value="resumen">Resumen</TabsTrigger>
            <TabsTrigger value="gastos">Gastos</TabsTrigger>
            <TabsTrigger value="ingresos">Ingresos</TabsTrigger>
            <TabsTrigger value="categorias">Por Categoría</TabsTrigger>
          </TabsList>

          {/* Pestaña de Resumen */}
          <TabsContent value="resumen" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Ingresos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalIngresos.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    {cambioIngresos >= 0 ? "+" : ""}
                    {cambioIngresos.toFixed(1)}% desde el mes pasado
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Gastos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalGastos.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    {cambioGastos >= 0 ? "+" : ""}
                    {cambioGastos.toFixed(1)}% desde el mes pasado
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Balance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${balance.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    {cambioBalance >= 0 ? "+" : ""}
                    {cambioBalance.toFixed(1)}% desde el mes pasado
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Ingresos vs Gastos</CardTitle>
                  <CardDescription>Comparativa mensual de ingresos y gastos</CardDescription>
                </CardHeader>
                <CardContent>
                  {hayTransacciones ? (
                    <Suspense fallback={<div>Cargando gráfico...</div>}>
                      <IncomeVsExpensesChart data={transaccionesActuales} />
                    </Suspense>
                  ) : (
                    <EmptyState
                      title="No hay datos para mostrar"
                      description="Agrega transacciones para ver la comparativa de ingresos y gastos."
                    />
                  )}
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Gastos por Categoría</CardTitle>
                  <CardDescription>Distribución de gastos del mes actual</CardDescription>
                </CardHeader>
                <CardContent>
                  {hayGastos ? (
                    <Suspense fallback={<div>Cargando gráfico...</div>}>
                      <ExpensesByCategory />
                    </Suspense>
                  ) : (
                    <EmptyState
                      title="No hay gastos registrados"
                      description="Agrega gastos para ver su distribución por categoría."
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Pestaña de Gastos */}
          <TabsContent value="gastos" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Listado de Gastos</CardTitle>
                <CardDescription>Datos crudos de gastos como están almacenados en la base de datos</CardDescription>
              </CardHeader>
              <CardContent>
                {hayGastos ? (
                  <Suspense fallback={<div>Cargando tabla...</div>}>
                    <TransactionsTable data={transaccionesActuales.filter((item) => item.action === "Gasto")} />
                  </Suspense>
                ) : (
                  <EmptyState
                    title="No hay gastos registrados"
                    description="Agrega gastos para verlos listados aquí."
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pestaña de Ingresos */}
          <TabsContent value="ingresos" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Listado de Ingresos</CardTitle>
                <CardDescription>Datos crudos de ingresos como están almacenados en la base de datos</CardDescription>
              </CardHeader>
              <CardContent>
                {hayIngresos ? (
                  <Suspense fallback={<div>Cargando tabla...</div>}>
                    <TransactionsTable data={transaccionesActuales.filter((item) => item.action === "Ingreso")} />
                  </Suspense>
                ) : (
                  <EmptyState
                    title="No hay ingresos registrados"
                    description="Agrega ingresos para verlos listados aquí."
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pestaña Por Categoría */}
          <TabsContent value="categorias" className="space-y-4">
            {hayTransacciones ? (
              <Suspense fallback={<div>Cargando datos...</div>}>
                <CategoryTransactions data={transaccionesActuales} />
              </Suspense>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Transacciones por Categoría</CardTitle>
                  <CardDescription>Datos crudos filtrados por categoría</CardDescription>
                </CardHeader>
                <CardContent>
                  <EmptyState
                    title="No hay transacciones registradas"
                    description="Agrega transacciones para verlas filtradas por categoría."
                  />
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    )
  } catch (error) {
    console.error("Error en la página de gastos:", error)
    return (
      <div className="flex flex-col">
        <div className="flex items-center justify-between space-y-2 py-4">
          <h2 className="text-3xl font-bold tracking-tight">Gastos e Ingresos</h2>
        </div>
        <ErrorMessage
          title="Error al cargar los datos"
          description="Ha ocurrido un error al cargar los datos de gastos e ingresos. Por favor, intenta nuevamente más tarde."
          retry={() => window.location.reload()}
        />
      </div>
    )
  }
}

