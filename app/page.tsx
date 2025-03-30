import { Suspense } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/dashboard/overview"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { InvestmentDistribution } from "@/components/dashboard/investment-distribution"
import { ExpensesByCategory } from "@/components/dashboard/expenses-by-category"
import { MonthSelector } from "@/components/month-selector"

export default function DashboardPage() {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between space-y-2 py-4">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Financiero</h2>
        <div className="flex items-center space-x-2">
          <MonthSelector />
        </div>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="investments">Inversiones</TabsTrigger>
          <TabsTrigger value="expenses">Gastos</TabsTrigger>
          <TabsTrigger value="exchange">Cambio de Divisas</TabsTrigger>
          <TabsTrigger value="wallets">Billeteras</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Balance Total (USD)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$12,345.67</div>
                <p className="text-xs text-muted-foreground">+20.1% desde el mes pasado</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inversiones Totales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$8,234.50</div>
                <p className="text-xs text-muted-foreground">+4.3% desde el mes pasado</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Gastos Mensuales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$1,234.56</div>
                <p className="text-xs text-muted-foreground">-12% desde el mes pasado</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tipo de Cambio USD/ARS</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,150.00</div>
                <p className="text-xs text-muted-foreground">+5.2% desde el mes pasado</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Resumen Financiero</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <Suspense fallback={<div>Cargando gráfico...</div>}>
                  <Overview />
                </Suspense>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Transacciones Recientes</CardTitle>
                <CardDescription>Últimas 5 transacciones realizadas</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<div>Cargando transacciones...</div>}>
                  <RecentTransactions />
                </Suspense>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Distribución de Inversiones</CardTitle>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<div>Cargando gráfico...</div>}>
                  <InvestmentDistribution />
                </Suspense>
              </CardContent>
            </Card>
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Gastos por Categoría</CardTitle>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<div>Cargando gráfico...</div>}>
                  <ExpensesByCategory />
                </Suspense>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="investments" className="space-y-4">
          {/* Contenido de la pestaña de inversiones */}
        </TabsContent>
        <TabsContent value="expenses" className="space-y-4">
          {/* Contenido de la pestaña de gastos */}
        </TabsContent>
        <TabsContent value="exchange" className="space-y-4">
          {/* Contenido de la pestaña de cambio de divisas */}
        </TabsContent>
        <TabsContent value="wallets" className="space-y-4">
          {/* Contenido de la pestaña de billeteras */}
        </TabsContent>
      </Tabs>
    </div>
  )
}

