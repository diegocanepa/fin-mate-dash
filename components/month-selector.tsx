"use client"

import { useState, useEffect } from "react"
import { format, addMonths, subMonths } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface MonthSelectorProps {
  onChange?: (year: number, month: number) => void
  initialDate?: Date
}

export function MonthSelector({ onChange, initialDate }: MonthSelectorProps) {
  const [date, setDate] = useState<Date>(initialDate || new Date())

  useEffect(() => {
    // Notificar al componente padre sobre el cambio de mes
    if (onChange) {
      onChange(date.getFullYear(), date.getMonth() + 1)
    }
  }, [date, onChange])

  const handlePreviousMonth = () => {
    const newDate = subMonths(date, 1)
    setDate(newDate)
  }

  const handleNextMonth = () => {
    const newDate = addMonths(date, 1)
    setDate(newDate)
  }

  const handleMonthSelect = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate)
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
            {date ? format(date, "MMMM yyyy", { locale: es }) : <span>Seleccionar mes</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleMonthSelect}
            initialFocus
            locale={es}
            captionLayout="dropdown-buttons"
            fromYear={2020}
            toYear={2030}
          />
        </PopoverContent>
      </Popover>

      <Button variant="outline" size="icon" onClick={handleNextMonth}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
