"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SearchIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { mockInvestments } from "@/lib/investment-data"
import { formatCurrency } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useVisibility } from "@/lib/visibility-context"
import { SensitiveValue } from "@/components/sensitive-value"

export function InvestmentHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [actionFilter, setActionFilter] = useState<"all" | "buy" | "sell">("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const { isVisible } = useVisibility()

  // Filtrar inversiones por término de búsqueda y tipo de acción
  const filteredInvestments = mockInvestments
    .filter((inv) => {
      const matchesSearch =
        inv.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.category.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesAction = actionFilter === "all" || inv.action === actionFilter

      return matchesSearch && matchesAction
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Ordenar por fecha descendente

  // Calcular paginación
  const totalPages = Math.ceil(filteredInvestments.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedInvestments = filteredInvestments.slice(startIndex, startIndex + itemsPerPage)

  // Manejar cambio de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
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
        <div className="w-full sm:w-[180px]">
          <Select value={actionFilter} onValueChange={(value) => setActionFilter(value as "all" | "buy" | "sell")}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="buy">Compras</SelectItem>
              <SelectItem value="sell">Ventas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Símbolo</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Plataforma</TableHead>
                <TableHead className="text-right">Cantidad</TableHead>
                <TableHead className="text-right">Precio Unitario</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedInvestments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No se encontraron operaciones
                  </TableCell>
                </TableRow>
              ) : (
                paginatedInvestments.map((investment) => {
                  const total = investment.amount * investment.unitPrice

                  return (
                    <TableRow key={investment.id}>
                      <TableCell>{new Date(investment.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={investment.action === "buy" ? "default" : "secondary"}>
                          {investment.action === "buy" ? "Compra" : "Venta"}
                        </Badge>
                      </TableCell>
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
                        <SensitiveValue>{formatCurrency(investment.unitPrice, investment.currency)}</SensitiveValue>
                      </TableCell>
                      <TableCell className="text-right">
                        <SensitiveValue>{formatCurrency(total, investment.currency)}</SensitiveValue>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Mostrando {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredInvestments.length)} de{" "}
            {filteredInvestments.length} operaciones
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page)}
                className="w-8 h-8 p-0"
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
