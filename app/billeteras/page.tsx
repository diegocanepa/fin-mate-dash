import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WalletBalances } from "@/components/dashboard/wallet-balances"
import { TransferHistoryTable } from "@/components/tables/transfer-history-table"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
// Importar funciones de la base de datos
// import { getBilleteras, getTransferencias, type Billetera, type Transferencia } from "@/lib/db"

// Datos de ejemplo - en producción vendrían de la API
const billeterasData = [
  { id: 1, nombre: "Wise", saldo: 4000, moneda: "USD", ultima_actualizacion: "2023-08-20T15:30:00Z" },
  { id: 2, nombre: "Deel", saldo: 3000, moneda: "USD", ultima_actualizacion: "2023-08-20T15:30:00Z" },
  { id: 3, nombre: "Revolut", saldo: 2000, moneda: "USD", ultima_actualizacion: "2023-08-20T15:30:00Z" },
  { id: 4, nombre: "Nexo", saldo: 2780, moneda: "USD", ultima_actualizacion: "2023-08-20T15:30:00Z" },
]

// Datos de ejemplo para transferencias
const transferenciasData = [
  {
    id: 1,
    fecha: "2023-08-10",
    billetera_origen: "Wise",
    billetera_destino: "Revolut",
    monto_inicial: 300,
    monto_final: 295,
    moneda: "USD",
    comision: 5,
    descripcion: "Transferencia mensual",
  },
  {
    id: 2,
    fecha: "2023-08-05",
    billetera_origen: "Deel",
    billetera_destino: "Wise",
    monto_inicial: 1500,
    monto_final: 1485,
    moneda: "USD",
    comision: 15,
    descripcion: "Transferencia de salario",
  },
  {
    id: 3,
    fecha: "2023-08-01",
    billetera_origen: "Revolut",
    billetera_destino: "Nexo",
    monto_inicial: 200,
    monto_final: 198,
    moneda: "USD",
    comision: 2,
    descripcion: "Inversión mensual",
  },
  {
    id: 4,
    fecha: "2023-07-28",
    billetera_origen: "Deel",
    billetera_destino: "Wise",
    monto_inicial: 2000,
    monto_final: 1980,
    moneda: "USD",
    comision: 20,
    descripcion: "Transferencia de salario",
  },
  {
    id: 5,
    fecha: "2023-07-20",
    billetera_origen: "Wise",
    billetera_destino: "Revolut",
    monto_inicial: 150,
    monto_final: 148.5,
    moneda: "USD",
    comision: 1.5,
    descripcion: "Gastos de viaje",
  },
]

/**
 * Calcula el saldo total de todas las billeteras
 */
function calcularSaldoTotal(billeteras: typeof billeterasData) {
  return billeteras.reduce((sum, billetera) => sum + billetera.saldo, 0)
}

/**
 * Calcula el número total de transferencias
 */
function calcularTotalTransferencias(transferencias: typeof transferenciasData) {
  return transferencias.length
}

/**
 * Calcula el cambio porcentual en el saldo total comparado con un período anterior
 */
function calcularCambioPorcentualSaldo(saldoActual: number, saldoAnterior: number) {
  if (saldoAnterior === 0) return 0
  return ((saldoActual - saldoAnterior) / saldoAnterior) * 100
}

/**
 * Filtra las transferencias por mes
 */
function filtrarTransferenciasPorMes(transferencias: typeof transferenciasData, year: number, month: number) {
  return transferencias.filter((t) => {
    const fecha = new Date(t.fecha)
    return fecha.getFullYear() === year && fecha.getMonth() + 1 === month
  })
}

export default function BilleterasPage() {
  // Código comentado para obtener datos reales de la base de datos
  /*
  async function getData() {
    // Obtener todas las billeteras
    const billeteras = await getBilleteras();
    
    // Obtener todas las transferencias
    const transferencias = await getTransferencias();
    
    // Obtener el mes y año actual para filtrar
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    
    // Obtener transferencias del mes actual
    const transferenciasActuales = transferencias.filter(t => {
      const fecha = new Date(t.fecha);
      return fecha.getFullYear() === currentYear && fecha.getMonth() + 1 === currentMonth;
    });
    
    // Obtener transferencias del mes anterior para comparar
    const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;
    const transferenciasAnteriores = transferencias.filter(t => {
      const fecha = new Date(t.fecha);
      return fecha.getFullYear() === lastMonthYear && fecha.getMonth() + 1 === lastMonth;
    });
    
    return {
      billeteras,
      transferencias,
      transferenciasActuales,
      transferenciasAnteriores
    };
  }
  
  const { billeteras, transferencias, transferenciasActuales, transferenciasAnteriores } = await getData();
  */

  // Usar datos de ejemplo mientras tanto
  const billeteras = billeterasData
  const transferencias = transferenciasData

  // Obtener el mes y año actual
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1

  // Filtrar transferencias por mes
  const transferenciasActuales = filtrarTransferenciasPorMes(transferencias, currentYear, currentMonth)

  // Obtener mes anterior
  const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1
  const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear
  const transferenciasAnteriores = filtrarTransferenciasPorMes(transferencias, lastMonthYear, lastMonth)

  // Calcular métricas
  const saldoTotal = calcularSaldoTotal(billeteras)
  const totalTransferencias = calcularTotalTransferencias(transferenciasActuales)
  const totalTransferenciasAnteriores = calcularTotalTransferencias(transferenciasAnteriores)

  // Supongamos un saldo anterior para la demostración
  const saldoAnterior = saldoTotal * 0.92 // 8% menos que el actual
  const cambioPorcentualSaldo = calcularCambioPorcentualSaldo(saldoTotal, saldoAnterior)

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between space-y-2 py-4">
        <h2 className="text-3xl font-bold tracking-tight">Billeteras y Saldos</h2>
        <div className="flex items-center space-x-2">
          <Link href="/agregar">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Agregar Transferencia
            </Button>
          </Link>
        </div>
      </div>
      <Tabs defaultValue="resumen" className="space-y-4">
        <TabsList>
          <TabsTrigger value="resumen">Resumen</TabsTrigger>
          <TabsTrigger value="historial">Historial de Transferencias</TabsTrigger>
          <TabsTrigger value="wise">Wise</TabsTrigger>
          <TabsTrigger value="deel">Deel</TabsTrigger>
          <TabsTrigger value="revolut">Revolut</TabsTrigger>
          <TabsTrigger value="nexo">Nexo</TabsTrigger>
        </TabsList>
        <TabsContent value="resumen" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Saldo Total (USD)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${saldoTotal.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {cambioPorcentualSaldo >= 0 ? "+" : ""}
                  {cambioPorcentualSaldo.toFixed(1)}% desde el mes pasado
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Transferencias</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalTransferencias}</div>
                <p className="text-xs text-muted-foreground">
                  {totalTransferencias - totalTransferenciasAnteriores >= 0 ? "+" : ""}
                  {totalTransferencias - totalTransferenciasAnteriores} desde el mes pasado
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-7">
              <CardHeader>
                <CardTitle>Saldos por Billetera</CardTitle>
                <CardDescription>Distribución de saldos en USD</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                  {billeteras.map((billetera) => (
                    <Card key={billetera.id} className="border-none shadow-none">
                      <CardHeader className="p-0">
                        <CardTitle className="text-lg">{billetera.nombre}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-0 pt-2">
                        <div className="text-2xl font-bold">${billetera.saldo.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                          {((billetera.saldo / saldoTotal) * 100).toFixed(1)}% del total
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <Suspense fallback={<div>Cargando gráfico...</div>}>
                  <WalletBalances />
                </Suspense>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="historial" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Transferencias</CardTitle>
              <CardDescription>Registro completo de transferencias entre billeteras</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Cargando tabla...</div>}>
                <TransferHistoryTable data={transferencias} />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="wise" className="space-y-4">
          {/* Contenido específico para Wise */}
          <Card>
            <CardHeader>
              <CardTitle>Detalles de Wise</CardTitle>
              <CardDescription>Información y movimientos de la billetera Wise</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Contenido específico para Wise en desarrollo</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="deel" className="space-y-4">
          {/* Contenido específico para Deel */}
          <Card>
            <CardHeader>
              <CardTitle>Detalles de Deel</CardTitle>
              <CardDescription>Información y movimientos de la billetera Deel</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Contenido específico para Deel en desarrollo</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="revolut" className="space-y-4">
          {/* Contenido específico para Revolut */}
          <Card>
            <CardHeader>
              <CardTitle>Detalles de Revolut</CardTitle>
              <CardDescription>Información y movimientos de la billetera Revolut</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Contenido específico para Revolut en desarrollo</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="nexo" className="space-y-4">
          {/* Contenido específico para Nexo */}
          <Card>
            <CardHeader>
              <CardTitle>Detalles de Nexo</CardTitle>
              <CardDescription>Información y movimientos de la billetera Nexo</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Contenido específico para Nexo en desarrollo</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

