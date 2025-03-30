import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MonthSelector } from "@/components/month-selector"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExpensesByCategory } from "@/components/dashboard/expenses-by-category"
import { TransactionsTable } from "@/components/tables/transactions-table"
import { IncomeVsExpensesChart } from "@/components/charts/income-vs-expenses-chart"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { CategoryTransactions } from "@/components/category-transactions"
// Importar funciones de la base de datos
// import { getGastosIngresos, getGastosIngresosByMonth, type GastoIngreso } from "@/lib/db"

// Datos de ejemplo - en producción vendrían de la API
const gastosData = [
  {
    id: 1,
    fecha: "2023-08-15",
    accion: "Gasto",
    amount: 120.5,
    moneda: "USD",
    categoria: "Comida",
    descripcion: "Supermercado",
  },
  {
    id: 2,
    fecha: "2023-08-10",
    accion: "Gasto",
    amount: 45.0,
    moneda: "USD",
    categoria: "Transporte",
    descripcion: "Gasolina",
  },
  {
    id: 3,
    fecha: "2023-08-05",
    accion: "Gasto",
    amount: 89.99,
    moneda: "USD",
    categoria: "Ocio",
    descripcion: "Cine y cena",
  },
  {
    id: 4,
    fecha: "2023-08-01",
    accion: "Ingreso",
    amount: 3000.0,
    moneda: "USD",
    categoria: "Salario",
    descripcion: "Salario mensual",
  },
  {
    id: 5,
    fecha: "2023-08-20",
    accion: "Gasto",
    amount: 200.0,
    moneda: "USD",
    categoria: "Vivienda",
    descripcion: "Internet y servicios",
  },
]

/**
 * Calcula el total de ingresos
 */
function calcularTotalIngresos(transacciones: typeof gastosData) {
  return transacciones.filter((t) => t.accion === "Ingreso").reduce((sum, t) => sum + t.amount, 0)
}

/**
 * Calcula el total de gastos
 */
function calcularTotalGastos(transacciones: typeof gastosData) {
  return transacciones.filter((t) => t.accion === "Gasto").reduce((sum, t) => sum + t.amount, 0)
}

/**
 * Calcula el balance (ingresos - gastos)
 */
function calcularBalance(transacciones: typeof gastosData) {
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

export default function GastosPage() {
  // Código comentado para obtener datos reales de la base de datos
  /*
  async function getData() {
    // Obtener el mes y año actual para filtrar
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    
    // Obtener transacciones del mes actual
    const transaccionesActuales = await getGastosIngresosByMonth(currentYear, currentMonth);
    
    // Obtener transacciones del mes anterior para comparar
    const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;
    const transaccionesAnteriores = await getGastosIngresosByMonth(lastMonthYear, lastMonth);
    
    return {
      transaccionesActuales,
      transaccionesAnteriores
    };
  }
  
  const { transaccionesActuales, transaccionesAnteriores } = await getData();
  */

  // Usar datos de ejemplo mientras tanto
  const transaccionesActuales = gastosData
  const transaccionesAnteriores: typeof gastosData = []

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
                <Suspense fallback={<div>Cargando gráfico...</div>}>
                  <IncomeVsExpensesChart data={transaccionesActuales} />
                </Suspense>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Gastos por Categoría</CardTitle>
                <CardDescription>Distribución de gastos del mes actual</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<div>Cargando gráfico...</div>}>
                  <ExpensesByCategory />
                </Suspense>
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
              <Suspense fallback={<div>Cargando tabla...</div>}>
                <TransactionsTable data={transaccionesActuales.filter((item) => item.accion === "Gasto")} />
              </Suspense>
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
              <Suspense fallback={<div>Cargando tabla...</div>}>
                <TransactionsTable data={transaccionesActuales.filter((item) => item.accion === "Ingreso")} />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pestaña Por Categoría */}
        <TabsContent value="categorias" className="space-y-4">
          <Suspense fallback={<div>Cargando datos...</div>}>
            <CategoryTransactions data={transaccionesActuales} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}

