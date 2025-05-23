"use client"

import { useState, useEffect } from "react"
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

// Función auxiliar para formatear el mes y año
function formatMonthYear(date: Date): string {
  const month = date.toLocaleString("es", { month: "long" })
  const year = date.getFullYear()
  return `${month} ${year}`
}

interface MonthYearSelectorProps {
  onMonthYearChange: (year: number, month: number) => void
  initialYear?: number
  initialMonth?: number
}

export function MonthYearSelector({
  onMonthYearChange,
  initialYear = new Date().getFullYear(),
  initialMonth = new Date().getMonth() + 1,
}: MonthYearSelectorProps) {
  const [date, setDate] = useState<Date>(new Date(initialYear, initialMonth - 1, 1))

  useEffect(() => {
    // Notificar al componente padre sobre el cambio de mes
    onMonthYearChange(date.getFullYear(), date.getMonth() + 1)
  }, [date, onMonthYearChange])

  const handlePreviousMonth = () => {
    const newDate = new Date(date)
    newDate.setMonth(date.getMonth() - 1)
    setDate(newDate)
  }

  const handleNextMonth = () => {
    const newDate = new Date(date)
    newDate.setMonth(date.getMonth() + 1)
    setDate(newDate)
  }

  const handleMonthSelect = (newDate: Date | undefined) => {
    if (newDate) {
      // Establecer el día al 1 para evitar problemas con meses de diferentes longitudes
      setDate(new Date(newDate.getFullYear(), newDate.getMonth(), 1))
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn("w-[180px] justify-start text-left font-normal", !date && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? formatMonthYear(date) : <span>Seleccionar mes</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleMonthSelect}
            initialFocus
            captionLayout="dropdown-buttons"
            fromYear={2020}
            toYear={2030}
            showOutsideDays={false}
          />
        </PopoverContent>
      </Popover>

      <Button variant="outline" size="icon" onClick={handleNextMonth}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
