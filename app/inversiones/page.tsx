import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DateRangePicker } from "@/components/date-range-picker"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { InvestmentDistributionDetailed } from "@/components/dashboard/investment-distribution-detailed"
// Importar funciones de la base de datos
// import { getInversiones, getInversionesByMonth, type Inversion } from "@/lib/db"

// Datos de ejemplo - en producción vendrían de la API
const inversionesData = [
  {
    id: 1,
    nombre: "AAPL - Apple Inc.",
    categoria: "Acciones",
    plataforma: "Interactive Brokers",
    cantidad: 10,
    precio_unidad: 180.5,
    valor_total: 1805,
    moneda: "USD",
    fecha_compra: "2023-05-15",
  },
  {
    id: 2,
    nombre: "MSFT - Microsoft Corp.",
    categoria: "Acciones",
    plataforma: "Interactive Brokers",
    cantidad: 5,
    precio_unidad: 330.2,
    valor_total: 1651,
    moneda: "USD",
    fecha_compra: "2023-06-10",
  },
  {
    id: 3,
    nombre: "Bitcoin",
    categoria: "Cripto",
    plataforma: "Binance",
    cantidad: 0.05,
    precio_unidad: 29500,
    valor_total: 1475,
    moneda: "USD",
    fecha_compra: "2023-07-05",
  },
  {
    id: 4,
    nombre: "Ethereum",
    categoria: "Cripto",
    plataforma: "Binance",
    cantidad: 0.8,
    precio_unidad: 1850,
    valor_total: 1480,
    moneda: "USD",
    fecha_compra: "2023-07-20",
  },
  {
    id: 5,
    nombre: "VTI - Vanguard Total Stock Market ETF",
    categoria: "ETFs",
    plataforma: "Interactive Brokers",
    cantidad: 8,
    precio_unidad: 220.75,
    valor_total: 1766,
    moneda: "USD",
    fecha_compra: "2023-04-18",
  },
  {
    id: 6,
    nombre: "Bono del Tesoro EE.UU. 10 años",
    categoria: "Bonos",
    plataforma: "Interactive Brokers",
    cantidad: 1,
    precio_unidad: 950,
    valor_total: 950,
    moneda: "USD",
    fecha_compra: "2023-03-10",
  },
]

/**
 * Calcula el valor total de todas las inversiones
 */
function calcularTotalInvertido(inversiones: typeof inversionesData) {
  return inversiones.reduce((sum, inv) => sum + inv.valor_total, 0)
}

/**
 * Calcula el número de inversiones activas
 */
function calcularInversionesActivas(inversiones: typeof inversionesData) {
  return inversiones.length
}

/**
 * Calcula el rendimiento mensual basado en el historial de inversiones
 * Esta función debería comparar el valor actual con el valor del mes anterior
 */
function calcularRendimientoMensual(inversiones: typeof inversionesData, mesAnterior: typeof inversionesData = []) {
  // En un caso real, compararíamos con datos históricos
  // Por ahora, devolvemos un valor fijo para demostración
  return {
    valor: 89.45,
    porcentaje: 1.1,
  }
}

/**
 * Calcula totales por categoría
 */
function calcularTotalesPorCategoria(inversiones: typeof inversionesData) {
  return inversiones.reduce(
    (acc, inversion) => {
      const { categoria, valor_total } = inversion
      if (!acc[categoria]) {
        acc[categoria] = 0
      }
      acc[categoria] += valor_total
      return acc
    },
    {} as Record<string, number>,
  )
}

export default function InversionesPage() {
  // Código comentado para obtener datos reales de la base de datos
  /*
  async function getData() {
    // Obtener el mes y año actual para filtrar
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    
    // Obtener inversiones del mes actual
    const inversiones = await getInversionesByMonth(currentYear, currentMonth);
    
    // Obtener inversiones del mes anterior para comparar
    const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;
    const inversionesMesAnterior = await getInversionesByMonth(lastMonthYear, lastMonth);
    
    return {
      inversiones,
      inversionesMesAnterior
    };
  }
  
  const { inversiones, inversionesMesAnterior } = await getData();
  */

  // Usar datos de ejemplo mientras tanto
  const inversiones = inversionesData
  const inversionesMesAnterior: typeof inversionesData = []

  // Calcular métricas
  const totalInvertido = calcularTotalInvertido(inversiones)
  const inversionesActivas = calcularInversionesActivas(inversiones)
  const rendimientoMensual = calcularRendimientoMensual(inversiones, inversionesMesAnterior)
  const totalesPorCategoria = calcularTotalesPorCategoria(inversiones)

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between space-y-2 py-4">
        <h2 className="text-3xl font-bold tracking-tight">Inversiones</h2>
        <div className="flex items-center space-x-2">
          <DateRangePicker />
          <Link href="/agregar">
            <Button className="ml-4">
              <PlusCircle className="mr-2 h-4 w-4" />
              Agregar Inversión
            </Button>
          </Link>
        </div>
      </div>
      <Tabs defaultValue="resumen" className="space-y-4">
        <TabsList>
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
                <p className="text-xs text-muted-foreground">+4.3% desde el mes pasado</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inversiones Activas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{inversionesActivas}</div>
                <p className="text-xs text-muted-foreground">+2 desde el mes pasado</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rendimiento Mensual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+${rendimientoMensual.valor.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+{rendimientoMensual.porcentaje}% este mes</p>
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
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Distribución de Inversiones</CardTitle>
                <CardDescription>Distribución por inversión específica</CardDescription>
              </CardHeader>
              <CardContent>
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
}

