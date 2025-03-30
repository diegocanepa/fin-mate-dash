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

// Tipo para los datos de cambio de divisas
interface CambioDivisas {
  id: number
  fecha: string
  accion: string
  cantidad: number
  moneda_origen: string
  moneda_destino: string
  precio_cambio: number
  total: number
  descripcion: string
}

export const columns: ColumnDef<CambioDivisas>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div className="font-mono text-xs">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "fecha",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Fecha
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const fecha = new Date(row.getValue("fecha"))
      return <div>{fecha.toLocaleDateString()}</div>
    },
  },
  {
    accessorKey: "accion",
    header: "Acción",
    cell: ({ row }) => {
      const accion = row.getValue("accion") as string
      return <Badge variant={accion === "Compra" ? "default" : "secondary"}>{accion}</Badge>
    },
  },
  {
    accessorKey: "cantidad",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Cantidad
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const cantidad = Number.parseFloat(row.getValue("cantidad"))
      const moneda = row.getValue("moneda_origen") as string

      return (
        <div className="font-medium">
          {new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: moneda,
            currencyDisplay: "narrowSymbol",
          }).format(cantidad)}
        </div>
      )
    },
  },
  {
    accessorKey: "moneda_origen",
    header: "Moneda Origen",
  },
  {
    accessorKey: "moneda_destino",
    header: "Moneda Destino",
  },
  {
    accessorKey: "precio_cambio",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Tipo de Cambio
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const precio = Number.parseFloat(row.getValue("precio_cambio"))

      return (
        <div className="font-medium">
          {new Intl.NumberFormat("es-AR", {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          }).format(precio)}
        </div>
      )
    },
  },
  {
    accessorKey: "total",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Total
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const total = Number.parseFloat(row.getValue("total"))
      const moneda = row.getValue("moneda_destino") as string

      return (
        <div className="font-medium">
          {new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: moneda,
            currencyDisplay: "narrowSymbol",
          }).format(total)}
        </div>
      )
    },
  },
  {
    accessorKey: "descripcion",
    header: "Descripción",
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
  data: CambioDivisas[]
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
          value={(table.getColumn("descripcion")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("descripcion")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
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

