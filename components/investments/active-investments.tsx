"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowDownIcon, ArrowUpIcon, SearchIcon } from "lucide-react"
import { getActiveInvestments, getCurrentValue } from "@/lib/investment-data"
import { formatCurrency } from "@/lib/utils"
import { SensitiveValue } from "@/components/sensitive-value"
import { useQuotes } from "@/lib/quote-context"

export function ActiveInvestments() {
  const [searchTerm, setSearchTerm] = useState("")
  const { realTimePrices } = useQuotes()

  const activeInvestments = getActiveInvestments()

  // Filtrar inversiones por término de búsqueda
  const filteredInvestments = activeInvestments.filter(
    (inv) =>
      inv.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="relative flex-1 max-w-sm">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por símbolo, plataforma..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Símbolo</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Plataforma</TableHead>
                <TableHead className="text-right">Cantidad</TableHead>
                <TableHead className="text-right">Precio Promedio</TableHead>
                <TableHead className="text-right">Precio Actual</TableHead>
                <TableHead className="text-right">Valor Actual</TableHead>
                <TableHead className="text-right">Ganancia/Pérdida</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvestments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No se encontraron inversiones activas
                  </TableCell>
                </TableRow>
              ) : (
                filteredInvestments.map((investment) => {
                  const realTimePrice = realTimePrices[investment.symbol]
                  const currentValue = getCurrentValue(investment, realTimePrice)
                  const investedValue = investment.totalInvested
                  const profit = currentValue - investedValue
                  const profitPercentage = investedValue > 0 ? (profit / investedValue) * 100 : 0

                  return (
                    <TableRow key={investment.id}>
                      <TableCell className="font-medium">{investment.symbol}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{investment.category}</Badge>
                      </TableCell>
                      <TableCell>{investment.platform}</TableCell>
                      <TableCell className="text-right">
                        {investment.amount.toLocaleString("es-AR", {
                          maximumFractionDigits: investment.category === "criptomonedas" ? 8 : 2,
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <SensitiveValue>{formatCurrency(investment.averagePrice, investment.currency)}</SensitiveValue>
                      </TableCell>
                      <TableCell className="text-right">
                        <SensitiveValue>
                          {realTimePrice
                            ? formatCurrency(realTimePrice, investment.currency)
                            : formatCurrency(investment.unitPrice, investment.currency)}
                        </SensitiveValue>
                      </TableCell>
                      <TableCell className="text-right">
                        <SensitiveValue>{formatCurrency(currentValue, investment.currency)}</SensitiveValue>
                      </TableCell>
                      <TableCell className="text-right">
                        <div
                          className={`flex items-center justify-end ${profit >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {profit >= 0 ? (
                            <ArrowUpIcon className="mr-1 h-4 w-4" />
                          ) : (
                            <ArrowDownIcon className="mr-1 h-4 w-4" />
                          )}
                          <SensitiveValue>
                            <span>{profitPercentage.toFixed(2)}%</span>
                          </SensitiveValue>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
