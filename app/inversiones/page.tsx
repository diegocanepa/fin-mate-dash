import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { InvestmentDistributionDetailed } from "@/components/dashboard/investment-distribution-detailed"
import { getInversiones, getInversionesByMonth, type Inversion } from "@/lib/db"
import { ErrorMessage } from "@/components/ui/error-message"
import { EmptyState } from "@/components/ui/empty-state"
import { MonthSelector } from "@/components/month-selector"

/**
 * Calcula el valor total de todas las inversiones
 */
function calcularTotalInvertido(inversiones: Inversion[]) {
  return inversiones.reduce((sum, inv) => sum + inv.amout * inv.price, 0)
}

/**
 * Calcula el número de inversiones activas
 */
function calcularInversionesActivas(inversiones: Inversion[]) {
  return inversiones.filter((inv) => inv.action === "Compra").length
}

/**
 * Calcula el rendimiento mensual basado en el historial de inversiones
 * Esta función debería comparar el valor actual con el valor del mes anterior
 */
function calcularRendimientoMensual(inversiones: Inversion[], inversionesAnteriores: Inversion[]) {
  const valorActual = calcularTotalInvertido(inversiones)
  const valorAnterior = calcularTotalInvertido(inversionesAnteriores)

  const diferencia = valorActual - valorAnterior
  const porcentaje = valorAnterior > 0 ? (diferencia / valorAnterior) * 100 : 0

  return {
    valor: diferencia,
    porcentaje: porcentaje,
  }
}

/**
 * Prepara los datos de inversiones para mostrar en la interfaz
 */
function prepararDatosInversiones(inversiones: Inversion[]) {
  return inversiones.map((inv) => ({
    id: inv.id,
    nombre: inv.description,
    categoria: inv.category,
    plataforma: inv.platform,
    cantidad: inv.amout,
    precio_unidad: inv.price,
    valor_total: inv.amout * inv.price,
    moneda: inv.currency,
    fecha_compra: new Date(inv.date).toISOString().split("T")[0],
  }))
}

export default async function InversionesPage() {
  try {
    // Obtener el mes y año actual para filtrar
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth() + 1

    // Obtener inversiones del mes actual
    const inversionesActuales = await getInversionesByMonth(currentYear, currentMonth)

    // Obtener inversiones del mes anterior para comparar
    const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1
    const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear
    const inversionesAnteriores = await getInversionesByMonth(lastMonthYear, lastMonth)

    // Obtener todas las inversiones activas
    const todasLasInversiones = await getInversiones()
    const inversionesActivas = todasLasInversiones.filter((inv) => inv.action === "Compra")

    // Verificar si hay inversiones
    const hayInversiones = inversionesActivas.length > 0

    // Preparar datos para la interfaz
    const inversiones = prepararDatosInversiones(inversionesActivas)

    // Calcular métricas
    const totalInvertido = calcularTotalInvertido(inversionesActivas)
    const numInversionesActivas = calcularInversionesActivas(inversionesActivas)
    const rendimientoMensual = calcularRendimientoMensual(inversionesActuales, inversionesAnteriores)

    return (
      <div className="flex flex-col">
        <div className="flex items-center justify-between space-y-2 py-4">
          <h2 className="text-3xl font-bold tracking-tight">Inversiones</h2>
          <div className="flex items-center space-x-2">
            <MonthSelector />
          </div>
        </div>
        <Tabs defaultValue="resumen" className="space-y-4">
          <TabsList className="flex flex-wrap">
            <TabsTrigger value="resumen">Resumen</TabsTrigger>
            <TabsTrigger value="acciones">Acciones</TabsTrigger>
            <TabsTrigger value="bonos">Bonos</TabsTrigger>
            <TabsTrigger value="cripto">Criptomonedas</TabsTrigger>
            <TabsTrigger value="etfs">ETFs</TabsTrigger>
          </TabsList>
          <TabsContent value="resumen" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Invertido</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalInvertido.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    {rendimientoMensual.porcentaje >= 0 ? "+" : ""}
                    {rendimientoMensual.porcentaje.toFixed(1)}% desde el mes pasado
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Inversiones Activas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{numInversionesActivas}</div>
                  <p className="text-xs text-muted-foreground">
                    {numInversionesActivas - calcularInversionesActivas(inversionesAnteriores) >= 0 ? "+" : ""}
                    {numInversionesActivas - calcularInversionesActivas(inversionesAnteriores)} desde el mes pasado
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Rendimiento Mensual</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {rendimientoMensual.valor >= 0 ? "+" : ""}${Math.abs(rendimientoMensual.valor).toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {rendimientoMensual.porcentaje >= 0 ? "+" : ""}
                    {rendimientoMensual.porcentaje.toFixed(1)}% este mes
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Detalle de Inversiones</CardTitle>
                  <CardDescription>Monto invertido en cada activo</CardDescription>
                </CardHeader>
                <CardContent>
                  {hayInversiones ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nombre</TableHead>
                          <TableHead>Categoría</TableHead>
                          <TableHead>Plataforma</TableHead>
                          <TableHead className="text-right">Valor (USD)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {inversiones.map((inversion) => (
                          <TableRow key={inversion.id}>
                            <TableCell className="font-medium">{inversion.nombre}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{inversion.categoria}</Badge>
                            </TableCell>
                            <TableCell>{inversion.plataforma}</TableCell>
                            <TableCell className="text-right">${inversion.valor_total.toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <EmptyState
                      title="No hay inversiones activas"
                      description="Agrega tu primera inversión para comenzar a hacer un seguimiento de tu cartera."
                    />
                  )}
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Distribución de Inversiones</CardTitle>
                  <CardDescription>Distribución por inversión específica</CardDescription>
                </CardHeader>
                <CardContent>
                  {hayInversiones ? (
                    <>
                      <div className="space-y-4 mb-6">
                        {inversiones.map((inversion) => (
                          <div key={inversion.id} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Badge variant="outline" className="mr-2">
                                {inversion.nombre}
                              </Badge>
                            </div>
                            <div className="font-medium">
                              ${inversion.valor_total.toLocaleString()}
                              <span className="text-xs text-muted-foreground ml-2">
                                ({((inversion.valor_total / totalInvertido) * 100).toFixed(1)}%)
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Suspense fallback={<div>Cargando gráfico...</div>}>
                        <InvestmentDistributionDetailed data={inversiones} />
                      </Suspense>
                    </>
                  ) : (
                    <EmptyState
                      title="No hay datos para mostrar"
                      description="Agrega inversiones para ver su distribución en el gráfico."
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="acciones" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Inversiones en Acciones</CardTitle>
                <CardDescription>Detalle de tus inversiones en acciones</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center py-10">
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-2">Estamos trabajando en esta sección</h3>
                  <p className="text-muted-foreground">
                    Pronto podrás ver el detalle completo de tus inversiones en acciones.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="bonos" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Inversiones en Bonos</CardTitle>
                <CardDescription>Detalle de tus inversiones en bonos</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center py-10">
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-2">Estamos trabajando en esta sección</h3>
                  <p className="text-muted-foreground">
                    Pronto podrás ver el detalle completo de tus inversiones en bonos.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="cripto" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Inversiones en Criptomonedas</CardTitle>
                <CardDescription>Detalle de tus inversiones en criptomonedas</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center py-10">
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-2">Estamos trabajando en esta sección</h3>
                  <p className="text-muted-foreground">
                    Pronto podrás ver el detalle completo de tus inversiones en criptomonedas.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="etfs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Inversiones en ETFs</CardTitle>
                <CardDescription>Detalle de tus inversiones en ETFs</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center py-10">
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-2">Estamos trabajando en esta sección</h3>
                  <p className="text-muted-foreground">
                    Pronto podrás ver el detalle completo de tus inversiones en ETFs.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    )
  } catch (error) {
    console.error("Error en la página de inversiones:", error)
    return (
      <div className="flex flex-col">
        <div className="flex items-center justify-between space-y-2 py-4">
          <h2 className="text-3xl font-bold tracking-tight">Inversiones</h2>
        </div>
        <ErrorMessage
          title="Error al cargar los datos"
          description="Ha ocurrido un error al cargar los datos de inversiones. Por favor, intenta nuevamente más tarde."
          retry={() => window.location.reload()}
        />
      </div>
    )
  }
}

