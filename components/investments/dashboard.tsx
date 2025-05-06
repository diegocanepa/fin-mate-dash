"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownIcon, ArrowUpIcon, DollarSignIcon, PercentIcon, TrendingUpIcon, WalletIcon } from "lucide-react"
import {
  getActiveInvestments,
  getInvestedCapital,
  getCurrentTotalValue,
  getTotalProfit,
  getRealizedProfit,
} from "@/lib/investment-data"
import { SensitiveValue } from "@/components/sensitive-value"
import { useQuotes } from "@/lib/quote-context"

export function InvestmentDashboard() {
  const { realTimePrices } = useQuotes()

  const activeInvestments = getActiveInvestments()
  const investedCapital = getInvestedCapital(activeInvestments)
  const currentValue = getCurrentTotalValue(activeInvestments, realTimePrices)
  const totalProfit = getTotalProfit(activeInvestments, realTimePrices)
  const realizedProfit = getRealizedProfit()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Capital Invertido</CardTitle>
          <WalletIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <SensitiveValue>${investedCapital.toLocaleString("es-AR", { maximumFractionDigits: 0 })}</SensitiveValue>
          </div>
          <p className="text-xs text-muted-foreground">Total invertido en posiciones activas</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Valor Actual</CardTitle>
          <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <SensitiveValue>${currentValue.toLocaleString("es-AR", { maximumFractionDigits: 0 })}</SensitiveValue>
          </div>
          <p className="text-xs text-muted-foreground">Valor estimado de mercado</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Rentabilidad</CardTitle>
          <PercentIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold flex items-center ${totalProfit.value >= 0 ? "text-green-600" : "text-red-600"}`}
          >
            {totalProfit.value >= 0 ? (
              <ArrowUpIcon className="mr-1 h-4 w-4" />
            ) : (
              <ArrowDownIcon className="mr-1 h-4 w-4" />
            )}
            <SensitiveValue>{totalProfit.percentage.toFixed(2)}%</SensitiveValue>
          </div>
          <p className={`text-sm ${totalProfit.value >= 0 ? "text-green-600" : "text-red-600"}`}>
            <SensitiveValue>${totalProfit.value.toLocaleString("es-AR", { maximumFractionDigits: 0 })}</SensitiveValue>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ganancia Realizada</CardTitle>
          <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${realizedProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
            <SensitiveValue>${realizedProfit.toLocaleString("es-AR", { maximumFractionDigits: 0 })}</SensitiveValue>
          </div>
          <p className="text-xs text-muted-foreground">Ganancias de inversiones cerradas</p>
        </CardContent>
      </Card>
    </div>
  )
}
