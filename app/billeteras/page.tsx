"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WalletBalances } from "@/components/dashboard/wallet-balances"
import { TransferHistoryTable } from "@/components/tables/transfer-history-table"
import { getBilleteras, getTransfers, getTransfersByMonth, type Transfer, type Billetera } from "@/lib/db"
import { ErrorMessage } from "@/components/ui/error-message"
import { EmptyState } from "@/components/ui/empty-state"
import { DateRangePicker } from "@/components/date-range-picker"
import { SensitiveValue } from "@/components/ui/sensitive-value"

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
    // Manejar casos donde wallet_from o wallet_to pueden ser nulos
    const esWalletFromPropia = t.wallet_from ? billeteras.some((b) => b.name === t.wallet_from) : false
    const esWalletToPropia = t.wallet_to ? billeteras.some((b) => b.name === t.wallet_to) : false

    if (esWalletFromPropia && !esWalletToPropia) {
      // Salida de dinero (wallet_from existe pero wallet_to no existe o no es propia)
      return sum - t.initial_amount
    } else if (!esWalletFromPropia && esWalletToPropia) {
      // Entrada de dinero (wallet_to existe pero wallet_from no existe o no es propia)
      return sum + t.final_amount
    }

    return sum
  }, 0)

  // El saldo anterior sería el saldo actual menos el cambio neto
  return saldoActual - cambioNeto
}

export default function BilleterasPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [billeteras, setBilleteras] = useState<Billetera[]>([])
  const [transferenciasActuales, setTransferenciasActuales] = useState<Transfer[]>([])
  const [transferenciasAnteriores, setTransferenciasAnteriores] = useState<Transfer[]>([])
  const [todasLasTransferencias, setTodasLasTransferencias] = useState<Transfer[]>([])
  const [filteredTransferencias, setFilteredTransferencias] = useState<Transfer[]>([])
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        // Obtener el mes y año actual para filtrar
        const now = new Date()
        const currentYear = now.getFullYear()
        const currentMonth = now.getMonth() + 1

        // Obtener todas las billeteras
        const billeterasData = await getBilleteras()
        setBilleteras(billeterasData)

        // Obtener transferencias del mes actual
        const transferenciasActualesData = await getTransfersByMonth(currentYear, currentMonth)
        setTransferenciasActuales(transferenciasActualesData)

        // Obtener transferencias del mes anterior para comparar
        const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1
        const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear
        const transferenciasAnterioresData = await getTransfersByMonth(lastMonthYear, lastMonth)
        setTransferenciasAnteriores(transferenciasAnterioresData)

        // Obtener todas las transferencias
        const todasLasTransferenciasData = await getTransfers()
        setTodasLasTransferencias(todasLasTransferenciasData)
        setFilteredTransferencias(todasLasTransferenciasData)
      } catch (err) {
        console.error("Error en la página de billeteras:", err)
        setError(err instanceof Error ? err : new Error("Error desconocido al cargar datos"))
      } finally {
        // Simular un tiempo de carga
        setTimeout(() => {
          setIsLoading(false)
        }, 1000)
      }
    }

    loadData()
  }, [])

  // Manejar el filtro de fecha para las transferencias
  const handleDateRangeChange = (range: { from: Date; to: Date } | undefined, e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault()
    }

    if (!range || !range.from || !range.to) {
      setFilteredTransferencias(todasLasTransferencias)
      return
    }

    const filtered = todasLasTransferencias.filter((item) => {
      const itemDate = new Date(item.date)
      return itemDate >= range.from && itemDate <= range.to
    })

    setFilteredTransferencias(filtered)
  }

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

  if (error) {
    return (
      <div className="flex flex-col">
        <div className="flex items-center justify-between space-y-2 py-4">
          <h2 className="text-3xl font-bold tracking-tight">Billeteras y Saldos</h2>
        </div>
        <ErrorMessage
          title="Error al cargar los datos"
          description={`Ha ocurrido un error al cargar los datos de billeteras: ${error.message}`}
          retry={() => window.location.reload()}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0 py-4">
        <h2 className="text-3xl font-bold tracking-tight">Billeteras y Saldos</h2>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
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
                  <div className="text-2xl font-bold">
                    <SensitiveValue value={saldoTotal} formatter={(value) => `$${Number(value).toLocaleString()}`} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <SensitiveValue
                      value={cambioPorcentualSaldo}
                      formatter={(value) =>
                        `${Number(value) >= 0 ? "+" : ""}${Number(value).toFixed(1)}% desde el mes pasado`
                      }
                      placeholder="••% desde el mes pasado"
                    />
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
                      <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                        {billeteras.map((billetera) => (
                          <Card key={billetera.name} className="border-none shadow-none">
                            <CardHeader className="p-0 sm:p-0">
                              <CardTitle className="text-base sm:text-lg truncate">{billetera.name}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0 pt-2 sm:p-0 sm:pt-2">
                              <div className="text-xl sm:text-2xl font-bold">
                                <SensitiveValue
                                  value={billetera.balance}
                                  formatter={(value) => `$${Number(value).toLocaleString()}`}
                                />
                              </div>
                              <p className="text-xs text-muted-foreground">
                                <SensitiveValue
                                  value={(billetera.balance / saldoTotal) * 100}
                                  formatter={(value) => `${Number(value).toFixed(1)}% del total`}
                                  placeholder="••% del total"
                                />
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
                    <div className="flex justify-end mb-4">
                      <DateRangePicker onChange={handleDateRangeChange} />
                    </div>
                    <TransferHistoryTable data={filteredTransferencias} />
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
      )}
    </div>
  )
}
