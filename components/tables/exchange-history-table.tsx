"use client"

import { useState } from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { Forex } from "@/lib/db"
// Importar SensitiveValue
import { SensitiveValue } from "@/components/ui/sensitive-value"

// Función para normalizar códigos de moneda
function normalizeCurrencyCode(code: string): string {
  if (!code) return "USD" // Valor por defecto si no hay código

  // Mapeo de nombres comunes a códigos ISO
  const currencyMap: Record<string, string> = {
    PESOS: "ARS",
    DOLAR: "USD",
    DOLARES: "USD",
    EURO: "EUR",
    EUROS: "EUR",
  }

  // Si el código está en el mapeo, devolver el código normalizado
  if (currencyMap[code.toUpperCase()]) {
    return currencyMap[code.toUpperCase()]
  }

  // Si el código ya tiene 3 letras, asumimos que es válido
  if (code.length === 3) {
    return code.toUpperCase()
  }

  // Por defecto, devolver ARS para pesos argentinos
  return "ARS"
}

export const columns: ColumnDef<Forex>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Fecha
          <ArrowUpDown className="ml-2 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const fecha = row.getValue("date") ? new Date(row.getValue("date")) : null
      return <div>{fecha ? fecha.toLocaleDateString() : <span className="text-muted-foreground">Sin fecha</span>}</div>
    },
  },
  {
    accessorKey: "action",
    header: "Acción",
    cell: ({ row }) => {
      const accion = row.getValue("action") as string
      if (!accion) return <span className="text-muted-foreground">No especificada</span>
      return <Badge variant={accion === "Compra" ? "default" : "secondary"}>{accion}</Badge>
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Cantidad
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    // Modificar las celdas relevantes
    cell: ({ row }) => {
      const cantidad = row.getValue("amount")
      const moneda = row.getValue("currency_from") as string

      // Si la cantidad no es un número válido, mostrar un mensaje
      if (cantidad === null || cantidad === undefined || isNaN(Number(cantidad))) {
        return <span className="text-muted-foreground">No disponible</span>
      }

      const normalizedCurrency = normalizeCurrencyCode(moneda)

      try {
        return (
          <div className="font-medium">
            <SensitiveValue
              value={Number(cantidad)}
              formatter={(value) =>
                new Intl.NumberFormat("es-AR", {
                  style: "currency",
                  currency: normalizedCurrency,
                  currencyDisplay: "narrowSymbol",
                }).format(Number(value))
              }
            />
          </div>
        )
      } catch (error) {
        // En caso de error, mostrar el valor sin formato
        return (
          <div className="font-medium">
            <SensitiveValue
              value={Number(cantidad)}
              formatter={(value) => `${Number(value).toFixed(2)} ${moneda || ""}`}
            />
          </div>
        )
      }
    },
  },
  {
    accessorKey: "currency_from",
    header: "Moneda Origen",
    cell: ({ row }) => {
      const currency = row.getValue("currency_from") as string
      return currency ? <div>{currency}</div> : <span className="text-muted-foreground">No especificada</span>
    },
  },
  {
    accessorKey: "currency_to",
    header: "Moneda Destino",
    cell: ({ row }) => {
      const currency = row.getValue("currency_to") as string
      return currency ? <div>{currency}</div> : <span className="text-muted-foreground">No especificada</span>
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Tipo de Cambio
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const precio = row.getValue("price")
      const monedaDestino = row.getValue("currency_to") as string

      // Si el precio no es un número válido, mostrar un mensaje
      if (precio === null || precio === undefined || isNaN(Number(precio))) {
        return <span className="text-muted-foreground">No disponible</span>
      }

      const normalizedCurrency = normalizeCurrencyCode(monedaDestino)

      try {
        return (
          <div className="font-medium">
            {new Intl.NumberFormat("es-AR", {
              style: "currency",
              currency: normalizedCurrency,
              currencyDisplay: "narrowSymbol",
            }).format(Number(precio))}
          </div>
        )
      } catch (error) {
        // En caso de error, mostrar el valor sin formato
        return (
          <div className="font-medium">
            {Number(precio).toFixed(2)} {monedaDestino || ""}
          </div>
        )
      }
    },
  },
  {
    id: "total",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Total
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = row.getValue("amount")
      const price = row.getValue("price")

      // Si alguno de los valores no es válido, mostrar un mensaje
      if (
        amount === null ||
        amount === undefined ||
        isNaN(Number(amount)) ||
        price === null ||
        price === undefined ||
        isNaN(Number(price))
      ) {
        return <span className="text-muted-foreground">No disponible</span>
      }

      const total = Number(amount) * Number(price)
      const moneda = row.getValue("currency_to") as string
      const normalizedCurrency = normalizeCurrencyCode(moneda)

      try {
        return (
          <div className="font-medium">
            {new Intl.NumberFormat("es-AR", {
              style: "currency",
              currency: normalizedCurrency,
              currencyDisplay: "narrowSymbol",
            }).format(total)}
          </div>
        )
      } catch (error) {
        // En caso de error, mostrar el valor sin formato
        return (
          <div className="font-medium">
            {total.toFixed(2)} {moneda || ""}
          </div>
        )
      }
    },
  },
  {
    accessorKey: "description",
    header: "Descripción",
    cell: ({ row }) => {
      const description = row.getValue("description") as string
      return description ? <div>{description}</div> : <span className="text-muted-foreground">Sin descripción</span>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const exchange = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(exchange.id.toString())}>
              Copiar ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Editar</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">Eliminar</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

interface ExchangeHistoryTableProps {
  data: Forex[]
}

export function ExchangeHistoryTable({ data }: ExchangeHistoryTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filtrar por descripción..."
          value={(table.getColumn("description")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("description")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No hay resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} registro(s) encontrado(s).
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  )
}
