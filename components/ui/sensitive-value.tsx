"use client"

import { useVisibility } from "@/lib/visibility-context"
import { cn } from "@/lib/utils"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SensitiveValueProps {
  value: string | number
  className?: string
  showCurrency?: boolean
  currency?: string
  isPositive?: boolean
  isNegative?: boolean
  showSign?: boolean
  formatter?: (value: number | string) => string
}

export function SensitiveValue({
  value,
  className,
  showCurrency = false,
  currency = "USD",
  isPositive = false,
  isNegative = false,
  showSign = false,
  formatter,
}: SensitiveValueProps) {
  const { isVisible, toggleVisibility } = useVisibility()

  // Función para formatear el valor
  const formatValue = (val: string | number) => {
    if (formatter) {
      return formatter(val)
    }

    if (typeof val === "number") {
      // Si es un número, formatearlo como moneda si showCurrency es true
      if (showCurrency) {
        try {
          return new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: currency || "ARS",
            minimumFractionDigits: 2,
          }).format(val)
        } catch (error) {
          // Si hay un error con la moneda, mostrar el número formateado sin símbolo de moneda
          return new Intl.NumberFormat("es-AR", {
            minimumFractionDigits: 2,
          }).format(val)
        }
      } else {
        // Si no es moneda, solo formatear el número
        return new Intl.NumberFormat("es-AR", {
          minimumFractionDigits: 2,
        }).format(val)
      }
    }

    // Si es string, devolverlo tal cual
    return val
  }

  // Determinar la clase de color basada en si es positivo o negativo
  const colorClass = isPositive ? "text-success" : isNegative ? "text-warning" : ""

  // Agregar signo + para valores positivos si showSign es true
  const displayValue = () => {
    let formattedValue = formatValue(value)
    if (showSign && isPositive && typeof value === "number" && value > 0) {
      formattedValue = "+" + formattedValue
    }
    return formattedValue
  }

  return (
    <div className="flex items-center gap-1">
      <span className={cn("font-medium tabular-nums transition-all duration-200", colorClass, className)}>
        {isVisible ? displayValue() : "••••••"}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6"
        onClick={toggleVisibility}
        title={isVisible ? "Ocultar valores" : "Mostrar valores"}
      >
        {isVisible ? (
          <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
        ) : (
          <Eye className="h-3.5 w-3.5 text-muted-foreground" />
        )}
        <span className="sr-only">{isVisible ? "Ocultar valores" : "Mostrar valores"}</span>
      </Button>
    </div>
  )
}
