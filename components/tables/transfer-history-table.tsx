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
import type { Transfer } from "@/lib/db"
import { SensitiveValue } from "@/components/ui/sensitive-value"

export const columns: ColumnDef<Transfer>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Fecha
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const fecha = new Date(row.getValue("date"))
      return <div>{fecha.toLocaleDateString()}</div>
    },
  },
  {
    accessorKey: "wallet_from",
    header: "Origen",
    cell: ({ row }) => {
      const walletFrom = row.getValue("wallet_from")
      return walletFrom ? <div>{walletFrom}</div> : <div className="text-muted-foreground italic">Externo</div>
    },
  },
  {
    accessorKey: "wallet_to",
    header: "Destino",
    cell: ({ row }) => {
      const walletTo = row.getValue("wallet_to")
      return walletTo ? <div>{walletTo}</div> : <div className="text-muted-foreground italic">Externo</div>
    },
  },
  {
    accessorKey: "initial_amount",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Monto Inicial
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const monto = Number.parseFloat(row.getValue("initial_amount"))
      const moneda = row.getValue("currency") as string

      return (
        <div className="font-medium">
          <SensitiveValue
            value={monto}
            formatter={(value) =>
              new Intl.NumberFormat("es-AR", {
                style: "currency",
                currency: moneda,
                currencyDisplay: "narrowSymbol",
              }).format(Number(value))
            }
          />
        </div>
      )
    },
  },
  {
    accessorKey: "final_amount",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Monto Final
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const monto = Number.parseFloat(row.getValue("final_amount"))
      const moneda = row.getValue("currency") as string

      if (monto === 0) {
        return <span className="text-muted-foreground">N/A</span>
      }

      return (
        <div className="font-medium">
          <SensitiveValue
            value={monto}
            formatter={(value) =>
              new Intl.NumberFormat("es-AR", {
                style: "currency",
                currency: moneda,
                currencyDisplay: "narrowSymbol",
              }).format(Number(value))
            }
          />
        </div>
      )
    },
  },
  {
    accessorKey: "currency",
    header: "Moneda",
  },
  {
    id: "comision",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Comisión
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const montoInicial = Number.parseFloat(row.getValue("initial_amount"))
      const montoFinal = Number.parseFloat(row.getValue("final_amount"))
      const moneda = row.getValue("currency") as string

      const esComisionNoCalculada = montoFinal === 0

      if (esComisionNoCalculada) {
        return <span className="text-muted-foreground">N/A</span>
      }

      const comision = montoInicial - montoFinal
      const porcentajeComision = montoInicial > 0 ? (comision / montoInicial) * 100 : 0

      return (
        <div className="font-medium">
          <SensitiveValue
            value={comision}
            formatter={(value) =>
              new Intl.NumberFormat("es-AR", {
                style: "currency",
                currency: moneda,
                currencyDisplay: "narrowSymbol",
              }).format(Number(value))
            }
          />
          <span className="text-xs text-muted-foreground ml-1">({porcentajeComision.toFixed(2)}%)</span>
        </div>
      )
    },
  },
  {
    accessorKey: "description",
    header: "Descripción",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const transferencia = row.original

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
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(transferencia.id.toString())}>
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

interface TransferHistoryTableProps {
  data: Transfer[]
}

export function TransferHistoryTable({ data }: TransferHistoryTableProps) {
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
