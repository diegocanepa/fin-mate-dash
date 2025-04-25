"use client"

import type React from "react"

import { useState } from "react"
import { ExchangeHistoryTable } from "@/components/tables/exchange-history-table"
import { PeriodEmptyState } from "@/components/ui/period-empty-state"
import { DateRangePicker } from "@/components/date-range-picker"
import type { Forex } from "@/lib/db"

interface FilterableExchangeTableProps {
  data: Forex[]
  showDateFilter?: boolean
}

export function FilterableExchangeTable({ data, showDateFilter = true }: FilterableExchangeTableProps) {
  const [filteredData, setFilteredData] = useState<Forex[]>(data)
  const [isFiltered, setIsFiltered] = useState(false)

  const handleDateRangeChange = (range: { from: Date; to: Date } | undefined, e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault()
    }

    if (!range || !range.from || !range.to) {
      setFilteredData(data)
      setIsFiltered(false)
      return
    }

    const filtered = data.filter((item) => {
      const itemDate = new Date(item.date)
      return itemDate >= range.from && itemDate <= range.to
    })

    setFilteredData(filtered)
    setIsFiltered(true)
  }

  const resetFilter = () => {
    setFilteredData(data)
    setIsFiltered(false)
  }

  return (
    <div>
      {showDateFilter && (
        <div className="flex justify-end mb-4">
          <DateRangePicker onChange={handleDateRangeChange} />
        </div>
      )}

      {filteredData.length > 0 ? (
        <ExchangeHistoryTable data={filteredData} />
      ) : (
        <PeriodEmptyState
          title="No hay operaciones en el período seleccionado"
          description="No se encontraron operaciones de cambio de divisas en el período de tiempo seleccionado. Prueba con otro rango de fechas o agrega nuevas operaciones."
          actionLabel="Agregar Cambio"
          actionHref="/agregar"
          onResetFilter={isFiltered ? resetFilter : undefined}
        />
      )}
    </div>
  )
}
