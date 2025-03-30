import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WalletBalances } from "@/components/dashboard/wallet-balances"
import { TransferHistoryTable } from "@/components/tables/transfer-history-table"
import { getBilleteras, getTransfers, getTransfersByMonth, type Transfer, type Billetera } from "@/lib/db"
import { ErrorMessage } from "@/components/ui/error-message"
import { EmptyState } from "@/components/ui/empty-state"
import { MonthSelector } from "@/components/month-selector"

/**
 * Calcula el saldo total de todas las billeteras
 */
function calcularSaldoTotal(billeteras: Billetera[]) {
  return billeteras.reduce((sum, billetera) => sum + billetera.balance, 0)
}

/**
 * Calcula el número total de transferencias
 */
function calcularTotalTransferencias(transferencias: Transfer[]) {
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
 * Estima el saldo anterior basado en transferencias
 */
function estimarSaldoAnterior(billeteras: Billetera[], transferenciasActuales: Transfer[]) {
  const saldoActual = calcularSaldoTotal(billeteras)

  // Calcular el cambio neto en el saldo debido a transferencias recientes
  const cambioNeto = transferenciasActuales.reduce((sum, t) => {
    // Asumimos que las transferencias entre billeteras propias no afectan el saldo total
    // Solo consideramos transferencias externas (donde wallet_from o wallet_to no está en nuestras billeteras)
    const esWalletFromPropia = billeteras.some((b) => b.name === t.wallet_from)
    const esWalletToPropia = billeteras.some((b) => b.name === t.wallet_to)

    if (esWalletFromPropia && !esWalletToPropia) {
      // Salida de dinero
      return sum - t.initial_amount
    } else if (!esWalletFromPropia && esWalletToPropia) {
      // Entrada de dinero
      return sum + t.final_amount
    }

    return sum
  }, 0)

  // El saldo anterior sería el saldo actual menos el cambio neto
  return saldoActual - cambioNeto
}

export default async function BilleterasPage() {
  try {
    // Obtener el mes y año actual para filtrar
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth() + 1

    // Obtener todas las billeteras
    const billeteras = await getBilleteras()

    // Obtener transferencias del mes actual
    const transferenciasActuales = await getTransfersByMonth(currentYear, currentMonth)

    // Obtener transferencias del mes anterior para comparar
    const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1
    const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear
    const transferenciasAnteriores = await getTransfersByMonth(lastMonthYear, lastMonth)

    // Obtener todas las transferencias
    const todasLasTransferencias = await getTransfers()

    // Verificar si hay billeteras y transferencias
    const hayBilleteras = billeteras.length > 0
    const hayTransferencias = todasLasTransferencias.length > 0

    // Calcular métricas
    const saldoTotal = calcularSaldoTotal(billeteras)
    const totalTransferencias = calcularTotalTransferencias(transferenciasActuales)
    const totalTransferenciasAnteriores = calcularTotalTransferencias(transferenciasAnteriores)

    // Estimar el saldo anterior
    const saldoAnterior = estimarSaldoAnterior(billeteras, transferenciasActuales)
    const cambioPorcentualSaldo = calcularCambioPorcentualSaldo(saldoTotal, saldoAnterior)

    return (
      <div className="flex flex-col">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0 py-4">
          <h2 className="text-3xl font-bold tracking-tight">Billeteras y Saldos</h2>
          <div className="flex items-center space-x-2">
            <MonthSelector />
          </div>
        </div>
        <Tabs defaultValue="resumen" className="space-y-4">
          <TabsList className="flex flex-wrap">
            <TabsTrigger value="resumen">Resumen</TabsTrigger>
            <TabsTrigger value="historial">Historial de Transferencias</TabsTrigger>
            <TabsTrigger value="wise">Wise</TabsTrigger>
            <TabsTrigger value="deel">Deel</TabsTrigger>
            <TabsTrigger value="revolut">Revolut</TabsTrigger>
            <TabsTrigger value="nexo">Nexo</TabsTrigger>
          </TabsList>
          <TabsContent value="resumen" className="space-y-4">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
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
                  {hayBilleteras ? (
                    <>
                      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                        {billeteras.map((billetera) => (
                          <Card key={billetera.name} className="border-none shadow-none">
                            <CardHeader className="p-0">
                              <CardTitle className="text-lg">{billetera.name}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0 pt-2">
                              <div className="text-2xl font-bold">${billetera.balance.toLocaleString()}</div>
                              <p className="text-xs text-muted-foreground">
                                {((billetera.balance / saldoTotal) * 100).toFixed(1)}% del total
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      <Suspense fallback={<div>Cargando gráfico...</div>}>
                        <WalletBalances wallets={billeteras} />
                      </Suspense>
                    </>
                  ) : (
                    <EmptyState
                      title="No hay billeteras registradas"
                      description="No hay billeteras registradas en el sistema."
                    />
                  )}
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
                {hayTransferencias ? (
                  <Suspense fallback={<div>Cargando tabla...</div>}>
                    <TransferHistoryTable data={todasLasTransferencias} />
                  </Suspense>
                ) : (
                  <EmptyState
                    title="No hay transferencias registradas"
                    description="No hay transferencias registradas en el sistema."
                  />
                )}
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
  } catch (error) {
    console.error("Error en la página de billeteras:", error)
    return (
      <div className="flex flex-col">
        <div className="flex items-center justify-between space-y-2 py-4">
          <h2 className="text-3xl font-bold tracking-tight">Billeteras y Saldos</h2>
        </div>
        <ErrorMessage
          title="Error al cargar los datos"
          description="Ha ocurrido un error al cargar los datos de billeteras. Por favor, intenta nuevamente más tarde."
          retry={() => window.location.reload()}
        />
      </div>
    )
  }
}

