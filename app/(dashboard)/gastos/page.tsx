"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MonthYearSelector } from "@/components/month-year-selector"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExpensesByCategoryChart } from "@/components/charts/expenses-by-category-chart"
import { TransactionsTable } from "@/components/tables/transactions-table"
import { IncomeVsExpensesChart } from "@/components/charts/income-vs-expenses-chart"
import { getTransactionsByMonth, type Transaction } from "@/lib/db"
import { ErrorMessage } from "@/components/ui/error-message"
import { EmptyState } from "@/components/ui/empty-state"
import { CurrencyFilter } from "@/components/currency-filter"
import { SensitiveValue } from "@/components/ui/sensitive-value"
import { useMediaQuery } from "@/hooks/use-media-query"

// Datos de ejemplo para usar cuando no hay conexión a la base de datos
const mockTransactions: Transaction[] = [
  {
    id: "1",
    description: "Salario mensual",
    amount: 2500,
    currency: "USD",
    category: "Salario",
    date: new Date().toISOString(),
    action: "ingreso",
  },
  {
    id: "2",
    description: "Alquiler",
    amount: 800,
    currency: "USD",
    category: "Vivienda",
    date: new Date().toISOString(),
    action: "gasto",
  },
  {
    id: "3",
    description: "Supermercado",
    amount: 150,
    currency: "USD",
    category: "Alimentación",
    date: new Date().toISOString(),
    action: "gasto",
  },
  {
    id: "4",
    description: "Freelance",
    amount: 500,
    currency: "USD",
    category: "Trabajo",
    date: new Date().toISOString(),
    action: "ingreso",
  },
  {
    id: "5",
    description: "Sueldo",
    amount: 150000,
    currency: "ARS",
    category: "Salario",
    date: new Date().toISOString(),
    action: "ingreso",
  },
  {
    id: "6",
    description: "Alquiler",
    amount: 80000,
    currency: "ARS",
    category: "Vivienda",
    date: new Date().toISOString(),
    action: "gasto",
  },
  {
    id: "7",
    description: "Supermercado",
    amount: 25000,
    currency: "ARS",
    category: "Alimentación",
    date: new Date().toISOString(),
    action: "gasto",
  },
]

export default function GastosPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [currentTransactions, setCurrentTransactions] = useState<Transaction[]>([])
  const [historicalData, setHistoricalData] = useState<
    Array<{
      year: number
      month: number
      transactions: Transaction[]
    }>
  >([])
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1)
  const [selectedCurrencyGastos, setSelectedCurrencyGastos] = useState<string | null>(null)
  const [selectedCurrencyIngresos, setSelectedCurrencyIngresos] = useState<string | null>(null)
  const [useMockData, setUseMockData] = useState(false)
  const isMobile = useMediaQuery("(max-width: 640px)")

  // Cargar datos cuando cambia el mes/año seleccionado
  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      try {
        // Intentar cargar transacciones del mes seleccionado
        const transactions = await getTransactionsByMonth(selectedYear, selectedMonth).catch((err) => {
          console.error("Error al cargar transacciones, usando datos de ejemplo:", err)
          setUseMockData(true)
          return mockTransactions
        })

        setCurrentTransactions(transactions)

        // Si estamos usando datos de ejemplo, crear datos históricos simulados
        if (useMockData) {
          const historicalMonths = []
          for (let i = 0; i < 5; i++) {
            let targetMonth = selectedMonth - i
            let targetYear = selectedYear

            while (targetMonth <= 0) {
              targetMonth += 12
              targetYear -= 1
            }

            // Generar datos históricos simulados con variaciones
            const monthTransactions = mockTransactions.map((t) => ({
              ...t,
              amount: t.amount * (0.9 + Math.random() * 0.2), // Variar entre 90% y 110%
              date: new Date(targetYear, targetMonth - 1, 15).toISOString(),
            }))

            historicalMonths.push({
              year: targetYear,
              month: targetMonth,
              transactions: monthTransactions,
            })
          }
          setHistoricalData(historicalMonths)
        } else {
          // Cargar datos históricos reales (mes actual y 4 meses anteriores)
          const historicalMonths = []
          for (let i = 0; i < 5; i++) {
            let targetMonth = selectedMonth - i
            let targetYear = selectedYear

            while (targetMonth <= 0) {
              targetMonth += 12
              targetYear -= 1
            }

            const monthTransactions = await getTransactionsByMonth(targetYear, targetMonth).catch(() =>
              mockTransactions.map((t) => ({
                ...t,
                date: new Date(targetYear, targetMonth - 1, 15).toISOString(),
              })),
            )

            historicalMonths.push({
              year: targetYear,
              month: targetMonth,
              transactions: monthTransactions,
            })
          }
          setHistoricalData(historicalMonths)
        }
      } catch (err) {
        console.error("Error al cargar datos:", err)
        setError(err instanceof Error ? err : new Error("Error desconocido al cargar datos"))

        // Usar datos de ejemplo en caso de error
        setCurrentTransactions(mockTransactions)
        setUseMockData(true)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [selectedYear, selectedMonth, useMockData])

  // Función para manejar el cambio de mes/año
  const handleMonthYearChange = (year: number, month: number) => {
    setSelectedYear(year)
    setSelectedMonth(month)
  }

  // Filtrar transacciones por moneda
  const transaccionesPesos = currentTransactions.filter((t) => t.currency === "ARS")
  const transaccionesDolares = currentTransactions.filter((t) => t.currency === "USD")

  // Filtrar transacciones por tipo y moneda para las pestañas de gastos e ingresos
  const gastos = currentTransactions.filter((t) => t.action === "gasto")
  const ingresos = currentTransactions.filter((t) => t.action === "ingreso")

  const gastosFiltrados = selectedCurrencyGastos ? gastos.filter((t) => t.currency === selectedCurrencyGastos) : gastos

  const ingresosFiltrados = selectedCurrencyIngresos
    ? ingresos.filter((t) => t.currency === selectedCurrencyIngresos)
    : ingresos

  // Calcular totales para pesos
  const totalIngresosPesos = transaccionesPesos
    .filter((t) => t.action === "ingreso")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalGastosPesos = transaccionesPesos.filter((t) => t.action === "gasto").reduce((sum, t) => sum + t.amount, 0)

  const balancePesos = totalIngresosPesos - totalGastosPesos

  // Calcular totales para dólares
  const totalIngresosDolares = transaccionesDolares
    .filter((t) => t.action === "ingreso")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalGastosDolares = transaccionesDolares
    .filter((t) => t.action === "gasto")
    .reduce((sum, t) => sum + t.amount, 0)

  const balanceDolares = totalIngresosDolares - totalGastosDolares

  // Verificar si hay datos
  const hayTransaccionesPesos = transaccionesPesos.length > 0
  const hayGastosPesos = transaccionesPesos.some((t) => t.action === "gasto")
  const hayIngresosPesos = transaccionesPesos.some((t) => t.action === "ingreso")

  const hayTransaccionesDolares = transaccionesDolares.length > 0
  const hayGastosDolares = transaccionesDolares.some((t) => t.action === "gasto")
  const hayIngresosDolares = transaccionesDolares.some((t) => t.action === "ingreso")

  // Filtrar datos históricos por moneda
  const historicalDataPesos = historicalData.map((month) => ({
    ...month,
    transactions: month.transactions.filter((t) => t.currency === "ARS"),
  }))

  const historicalDataDolares = historicalData.map((month) => ({
    ...month,
    transactions: month.transactions.filter((t) => t.currency === "USD"),
  }))

  if (error && !useMockData) {
    return (
      <div className="flex flex-col">
        <div className="flex items-center justify-between space-y-2 py-4">
          <h2 className="text-3xl font-bold tracking-tight">Gastos e Ingresos</h2>
        </div>
        <ErrorMessage
          title="Error al cargar los datos"
          description={`Ha ocurrido un error al cargar los datos: ${error.message}`}
          retry={() => window.location.reload()}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0 py-4">
        <h2 className="text-3xl font-bold tracking-tight">Gastos e Ingresos</h2>
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
        <Tabs defaultValue="pesos" className="space-y-4">
          <TabsList className="flex flex-wrap">
            <TabsTrigger value="pesos">Pesos</TabsTrigger>
            <TabsTrigger value="dolares">Dólares</TabsTrigger>
            <TabsTrigger value="gastos">Gastos</TabsTrigger>
            <TabsTrigger value="ingresos">Ingresos</TabsTrigger>
          </TabsList>

          {/* Pestaña de Pesos */}
          <TabsContent value="pesos" className="space-y-4">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Ingresos Pesos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    <SensitiveValue
                      value={totalIngresosPesos}
                      formatter={(value) => `$${Number(value).toLocaleString()} ARS`}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Período: {selectedMonth}/{selectedYear}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Gastos Pesos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    <SensitiveValue
                      value={totalGastosPesos}
                      formatter={(value) => `$${Number(value).toLocaleString()} ARS`}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Período: {selectedMonth}/{selectedYear}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Balance Pesos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${balancePesos >= 0 ? "text-success" : "text-warning"}`}>
                    <SensitiveValue
                      value={balancePesos}
                      formatter={(value) => `$${Number(value).toLocaleString()} ARS`}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Período: {selectedMonth}/{selectedYear}
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
              <Card className="col-span-full lg:col-span-4">
                <CardHeader>
                  <CardTitle>Ingresos vs Gastos (Pesos)</CardTitle>
                  <CardDescription>Comparativa mensual de ingresos y gastos en pesos</CardDescription>
                </CardHeader>
                <CardContent>
                  {historicalDataPesos.some((month) => month.transactions.length > 0) ? (
                    <IncomeVsExpensesChart data={transaccionesPesos} historicalData={historicalDataPesos} />
                  ) : (
                    <EmptyState
                      title="No hay datos para mostrar"
                      description="No hay transacciones en pesos en los últimos 5 meses."
                    />
                  )}
                </CardContent>
              </Card>
              <Card className="col-span-full lg:col-span-3">
                <CardHeader>
                  <CardTitle>Gastos por Categoría (Pesos)</CardTitle>
                  <CardDescription>Distribución de gastos en pesos del mes actual</CardDescription>
                </CardHeader>
                <CardContent>
                  {hayGastosPesos ? (
                    <ExpensesByCategoryChart data={transaccionesPesos.filter((t) => t.action === "gasto")} />
                  ) : (
                    <EmptyState
                      title="No hay gastos registrados"
                      description="No hay gastos en pesos para el período seleccionado."
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Pestaña de Dólares */}
          <TabsContent value="dolares" className="space-y-4">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Ingresos Dólares</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    <SensitiveValue
                      value={totalIngresosDolares}
                      formatter={(value) => `$${Number(value).toLocaleString()} USD`}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Período: {selectedMonth}/{selectedYear}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Gastos Dólares</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    <SensitiveValue
                      value={totalGastosDolares}
                      formatter={(value) => `$${Number(value).toLocaleString()} USD`}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Período: {selectedMonth}/{selectedYear}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Balance Dólares</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${balanceDolares >= 0 ? "text-success" : "text-warning"}`}>
                    <SensitiveValue
                      value={balanceDolares}
                      formatter={(value) => `$${Number(value).toLocaleString()} USD`}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Período: {selectedMonth}/{selectedYear}
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
              <Card className="col-span-full lg:col-span-4">
                <CardHeader>
                  <CardTitle>Ingresos vs Gastos (Dólares)</CardTitle>
                  <CardDescription>Comparativa mensual de ingresos y gastos en dólares</CardDescription>
                </CardHeader>
                <CardContent>
                  {hayTransaccionesDolares ? (
                    <IncomeVsExpensesChart data={transaccionesDolares} historicalData={historicalDataDolares} />
                  ) : (
                    <EmptyState
                      title="No hay datos para mostrar"
                      description="No hay transacciones en dólares para el período seleccionado."
                    />
                  )}
                </CardContent>
              </Card>
              <Card className="col-span-full lg:col-span-3">
                <CardHeader>
                  <CardTitle>Gastos por Categoría (Dólares)</CardTitle>
                  <CardDescription>Distribución de gastos en dólares del mes actual</CardDescription>
                </CardHeader>
                <CardContent>
                  {hayGastosDolares ? (
                    <ExpensesByCategoryChart data={transaccionesDolares.filter((t) => t.action === "gasto")} />
                  ) : (
                    <EmptyState
                      title="No hay gastos registrados"
                      description="No hay gastos en dólares para el período seleccionado."
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Pestaña de Gastos */}
          <TabsContent value="gastos" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div>
                  <CardTitle>Listado de Gastos</CardTitle>
                  <CardDescription>Datos de gastos filtrados por moneda</CardDescription>
                </div>
                <CurrencyFilter onCurrencyChange={setSelectedCurrencyGastos} defaultCurrency={selectedCurrencyGastos} />
              </CardHeader>
              <CardContent>
                {gastosFiltrados.length > 0 ? (
                  <TransactionsTable data={gastosFiltrados} />
                ) : (
                  <EmptyState
                    title="No hay gastos registrados"
                    description={`No hay gastos ${selectedCurrencyGastos ? `en ${selectedCurrencyGastos}` : ""} para el período seleccionado.`}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pestaña de Ingresos */}
          <TabsContent value="ingresos" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div>
                  <CardTitle>Listado de Ingresos</CardTitle>
                  <CardDescription>Datos de ingresos filtrados por moneda</CardDescription>
                </div>
                <CurrencyFilter
                  onCurrencyChange={setSelectedCurrencyIngresos}
                  defaultCurrency={selectedCurrencyIngresos}
                />
              </CardHeader>
              <CardContent>
                {ingresosFiltrados.length > 0 ? (
                  <TransactionsTable data={ingresosFiltrados} />
                ) : (
                  <EmptyState
                    title="No hay ingresos registrados"
                    description={`No hay ingresos ${selectedCurrencyIngresos ? `en ${selectedCurrencyIngresos}` : ""} para el período seleccionado.`}
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
