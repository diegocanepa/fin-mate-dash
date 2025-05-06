"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowDownIcon, ArrowUpIcon, SearchIcon } from "lucide-react"
import { getClosedInvestments } from "@/lib/investment-data"
import { formatCurrency } from "@/lib/utils"

export function ClosedInvestments() {
  const [searchTerm, setSearchTerm] = useState("")
  const closedInvestments = getClosedInvestments()

  // Filtrar inversiones por término de búsqueda
  const filteredInvestments = closedInvestments.filter(
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
                <TableHead>Fecha Compra</TableHead>
                <TableHead>Fecha Venta</TableHead>
                <TableHead className="text-right">Cantidad</TableHead>
                <TableHead className="text-right">Rentabilidad</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvestments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No se encontraron inversiones cerradas
                  </TableCell>
                </TableRow>
              ) : (
                filteredInvestments.map((investment) => {
                  return (
                    <TableRow key={investment.id}>
                      <TableCell className="font-medium">{investment.symbol}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{investment.category}</Badge>
                      </TableCell>
                      <TableCell>{investment.platform}</TableCell>
                      <TableCell>{new Date(investment.buyDate).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(investment.sellDate).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        {investment.amount.toLocaleString("es-AR", {
                          maximumFractionDigits: investment.category === "criptomonedas" ? 8 : 2,
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div
                          className={`flex items-center justify-end ${investment.profit >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {investment.profit >= 0 ? (
                            <ArrowUpIcon className="mr-1 h-4 w-4" />
                          ) : (
                            <ArrowDownIcon className="mr-1 h-4 w-4" />
                          )}
                          <span>{investment.profitPercentage.toFixed(2)}%</span>
                        </div>
                        <div className={`text-xs ${investment.profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {formatCurrency(investment.profit, investment.currency)}
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
