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
import { Construction } from "lucide-react"
// Importar los componentes de cotizaciones
import { CryptoPrices } from "@/components/crypto/crypto-prices"
import { StockPrices } from "@/components/stocks/stock-prices"

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
 * Calcula el balance de inversiones por instrumento
 */
function calcularBalanceInversiones(inversiones: Inversion[]) {
  // Ordenar inversiones de más antiguas a más nuevas
  const inversionesOrdenadas = [...inversiones].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Crear un diccionario para almacenar el balance por instrumento
  const balancePorInstrumento: Record<
    string,
    {
      nombre: string
      categoria: string
      plataforma: string
      moneda: string
      cantidad: number
      valorTotal: number
    }
  > = {}

  // Procesar cada inversión
  inversionesOrdenadas.forEach((inv) => {
    const clave = `${inv.description}-${inv.platform}-${inv.category}`

    if (!balancePorInstrumento[clave]) {
      balancePorInstrumento[clave] = {
        nombre: inv.description,
        categoria: inv.category,
        plataforma: inv.platform,
        moneda: inv.currency,
        cantidad: 0,
        valorTotal: 0,
      }
    }

    // Sumar o restar según sea compra o venta
    if (inv.action === "Compra") {
      balancePorInstrumento[clave].cantidad += inv.amout
      balancePorInstrumento[clave].valorTotal += inv.amout * inv.price
    } else if (inv.action === "Venta") {
      balancePorInstrumento[clave].cantidad -= inv.amout
      // No restamos el valor total porque queremos mantener el costo de adquisición
    }
  })

  // Convertir a array y filtrar solo los que tienen cantidad > 0
  return Object.values(balancePorInstrumento)
    .filter((inv) => inv.cantidad > 0)
    .map((inv) => ({
      ...inv,
      precioPromedio: inv.cantidad > 0 ? inv.valorTotal / inv.cantidad : 0,
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

    // Obtener todas las inversiones
    const todasLasInversiones = await getInversiones()

    // Calcular el balance de inversiones
    const balanceInversiones = calcularBalanceInversiones(todasLasInversiones)

    // Verificar si hay inversiones
    const hayInversiones = balanceInversiones.length > 0

    // Calcular métricas
    const totalInvertido = balanceInversiones.reduce((sum, inv) => sum + inv.valorTotal, 0)
    const numInversionesActivas = balanceInversiones.length
    const rendimientoMensual = calcularRendimientoMensual(inversionesActuales, inversionesAnteriores)

    return (
      <div className="flex flex-col">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0 py-4">
          <h2 className="text-3xl font-bold tracking-tight">Inversiones</h2>
          <div className="flex items-center space-x-2">
            <MonthSelector />
          </div>
        </div>
        <Tabs defaultValue="resumen" className="space-y-4">
          <TabsList className="flex flex-wrap">
            <TabsTrigger value="resumen">Resumen</TabsTrigger>
            <TabsTrigger value="cotizaciones">Cotizaciones</TabsTrigger>
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
                  <p className="text-xs text-muted-foreground">Instrumentos con posiciones abiertas</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Rendimiento Mensual</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-2">
                  <Construction className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground text-center">Estamos desarrollando esta funcionalidad</p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Detalle de Inversiones</CardTitle>
                  <CardDescription>Monto invertido en cada activo</CardDescription>
                </CardHeader>
                <CardContent className="overflow-auto">
                  {hayInversiones ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nombre</TableHead>
                          <TableHead>Categoría</TableHead>
                          <TableHead>Plataforma</TableHead>
                          <TableHead>Cantidad</TableHead>
                          <TableHead>Precio Promedio</TableHead>
                          <TableHead className="text-right">Valor Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {balanceInversiones.map((inversion, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{inversion.nombre}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{inversion.categoria}</Badge>
                            </TableCell>
                            <TableCell>{inversion.plataforma}</TableCell>
                            <TableCell>{inversion.cantidad.toLocaleString()}</TableCell>
                            <TableCell>${inversion.precioPromedio.toFixed(2)}</TableCell>
                            <TableCell className="text-right">${inversion.valorTotal.toLocaleString()}</TableCell>
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
                      <div className="space-y-4 mb-6 max-h-[200px] overflow-y-auto">
                        {balanceInversiones.map((inversion, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Badge variant="outline" className="mr-2">
                                {inversion.nombre}
                              </Badge>
                            </div>
                            <div className="font-medium">
                              ${inversion.valorTotal.toLocaleString()}
                              <span className="text-xs text-muted-foreground ml-2">
                                ({((inversion.valorTotal / totalInvertido) * 100).toFixed(1)}%)
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Suspense fallback={<div>Cargando gráfico...</div>}>
                        <InvestmentDistributionDetailed
                          data={balanceInversiones.map((inv) => ({
                            id: inv.nombre,
                            nombre: inv.nombre,
                            categoria: inv.categoria,
                            valor_total: inv.valorTotal,
                            moneda: inv.moneda,
                          }))}
                        />
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

          {/* Nueva pestaña de cotizaciones */}
          <TabsContent value="cotizaciones" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Cotizaciones en Tiempo Real</CardTitle>
                <CardDescription>Precios actuales de acciones, bonos y ETFs</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense
                  fallback={<div className="flex justify-center items-center h-40">Cargando cotizaciones...</div>}
                >
                  <StockPrices />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="acciones" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Inversiones en Acciones</CardTitle>
                <CardDescription>Detalle de tus inversiones en acciones</CardDescription>
              </CardHeader>
              <CardContent>
                {hayInversiones ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Plataforma</TableHead>
                        <TableHead>Cantidad</TableHead>
                        <TableHead>Precio Promedio</TableHead>
                        <TableHead className="text-right">Valor Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {balanceInversiones
                        .filter((inv) => inv.categoria === "Acciones")
                        .map((inversion, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{inversion.nombre}</TableCell>
                            <TableCell>{inversion.plataforma}</TableCell>
                            <TableCell>{inversion.cantidad.toLocaleString()}</TableCell>
                            <TableCell>${inversion.precioPromedio.toFixed(2)}</TableCell>
                            <TableCell className="text-right">${inversion.valorTotal.toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                ) : (
                  <EmptyState
                    title="No hay inversiones en acciones"
                    description="Agrega tu primera inversión en acciones para comenzar a hacer un seguimiento."
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="bonos" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Inversiones en Bonos</CardTitle>
                <CardDescription>Detalle de tus inversiones en bonos</CardDescription>
              </CardHeader>
              <CardContent>
                {hayInversiones ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Plataforma</TableHead>
                        <TableHead>Cantidad</TableHead>
                        <TableHead>Precio Promedio</TableHead>
                        <TableHead className="text-right">Valor Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {balanceInversiones
                        .filter((inv) => inv.categoria === "Bonos")
                        .map((inversion, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{inversion.nombre}</TableCell>
                            <TableCell>{inversion.plataforma}</TableCell>
                            <TableCell>{inversion.cantidad.toLocaleString()}</TableCell>
                            <TableCell>${inversion.precioPromedio.toFixed(2)}</TableCell>
                            <TableCell className="text-right">${inversion.valorTotal.toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                ) : (
                  <EmptyState
                    title="No hay inversiones en bonos"
                    description="Agrega tu primera inversión en bonos para comenzar a hacer un seguimiento."
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="cripto" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Cotizaciones de Criptomonedas</CardTitle>
                <CardDescription>Precios actuales de las principales criptomonedas</CardDescription>
              </CardHeader>
              <CardContent>
                <CryptoPrices />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Inversiones en Criptomonedas</CardTitle>
                <CardDescription>Detalle de tus inversiones en criptomonedas</CardDescription>
              </CardHeader>
              <CardContent>
                {hayInversiones ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Plataforma</TableHead>
                        <TableHead>Cantidad</TableHead>
                        <TableHead>Precio Promedio</TableHead>
                        <TableHead className="text-right">Valor Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {balanceInversiones
                        .filter((inv) => inv.categoria === "Cripto")
                        .map((inversion, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{inversion.nombre}</TableCell>
                            <TableCell>{inversion.plataforma}</TableCell>
                            <TableCell>{inversion.cantidad.toLocaleString()}</TableCell>
                            <TableCell>${inversion.precioPromedio.toFixed(2)}</TableCell>
                            <TableCell className="text-right">${inversion.valorTotal.toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                ) : (
                  <EmptyState
                    title="No hay inversiones en criptomonedas"
                    description="Agrega tu primera inversión en criptomonedas para comenzar a hacer un seguimiento."
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="etfs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Inversiones en ETFs</CardTitle>
                <CardDescription>Detalle de tus inversiones en ETFs</CardDescription>
              </CardHeader>
              <CardContent>
                {hayInversiones ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Plataforma</TableHead>
                        <TableHead>Cantidad</TableHead>
                        <TableHead>Precio Promedio</TableHead>
                        <TableHead className="text-right">Valor Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {balanceInversiones
                        .filter((inv) => inv.categoria === "ETFs")
                        .map((inversion, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{inversion.nombre}</TableCell>
                            <TableCell>{inversion.plataforma}</TableCell>
                            <TableCell>{inversion.cantidad.toLocaleString()}</TableCell>
                            <TableCell>${inversion.precioPromedio.toFixed(2)}</TableCell>
                            <TableCell className="text-right">${inversion.valorTotal.toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                ) : (
                  <EmptyState
                    title="No hay inversiones en ETFs"
                    description="Agrega tu primera inversión en ETFs para comenzar a hacer un seguimiento."
                  />
                )}
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
