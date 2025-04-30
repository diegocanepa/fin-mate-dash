"use client"

import { useState, useEffect } from "react"
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { EmptyState } from "@/components/ui/empty-state"
import { useMediaQuery } from "@/hooks/use-media-query"
import { ResponsiveChartContainer } from "@/components/ui/responsive-chart-container"

interface GastoIngreso {
  id: number | string
  fecha?: string
  accion?: string
  amount: number
  moneda?: string
  categoria?: string
  descripcion?: string
  action?: string // Optional property to handle both 'accion' and 'action'
  category?: string // Optional property to handle both 'categoria' and 'category'
  currency?: string // Optional property to handle both 'moneda' and 'currency'
  date?: string // Optional property to handle both 'fecha' and 'date'
  description?: string // Optional property to handle both 'descripcion' and 'description'
}

interface IncomeVsExpensesChartProps {
  data: GastoIngreso[]
  historicalData?: Array<{
    year: number
    month: number
    transactions: GastoIngreso[]
  }>
}

export function IncomeVsExpensesChart({ data, historicalData }: IncomeVsExpensesChartProps) {
  const [chartData, setChartData] = useState<any[]>([])
  const [hasData, setHasData] = useState(false)
  const isMobile = useMediaQuery("(max-width: 640px)")

  useEffect(() => {
    let processedData = []

    // Si tenemos datos históricos, los procesamos
    if (historicalData && historicalData.length > 0) {
      // Procesar datos históricos
      processedData = historicalData
        .map((monthData) => {
          const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
          const monthName = monthNames[monthData.month - 1]
          const yearShort = monthData.year.toString().slice(2)
          const label = `${monthName}/${yearShort}`

          // Calcular ingresos y gastos para este mes
          const ingresos = monthData.transactions
            .filter((item) => item.action === "ingreso" || item.accion === "Ingreso")
            .reduce((sum, item) => sum + item.amount, 0)

          const gastos = monthData.transactions
            .filter((item) => item.action === "gasto" || item.accion === "Gasto")
            .reduce((sum, item) => sum + item.amount, 0)

          return {
            month: label,
            ingresos,
            gastos,
            balance: ingresos - gastos,
          }
        })
        .reverse() // Mostrar en orden cronológico
    } else {
      // Procesar datos del mes actual (comportamiento original)
      const groupedByMonth = data.reduce(
        (acc, item) => {
          const date = new Date(item.fecha || item.date || new Date())
          const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`

          if (!acc[monthYear]) {
            acc[monthYear] = {
              month: monthYear,
              ingresos: 0,
              gastos: 0,
            }
          }

          if (item.accion === "Ingreso" || item.action === "ingreso") {
            acc[monthYear].ingresos += item.amount
          } else if (item.accion === "Gasto" || item.action === "gasto") {
            acc[monthYear].gastos += item.amount
          }

          return acc
        },
        {} as Record<string, { month: string; ingresos: number; gastos: number }>,
      )

      // Convertir a array y ordenar por fecha
      processedData = Object.values(groupedByMonth)
      processedData.sort((a, b) => {
        const [monthA, yearA] = a.month.split("/")
        const [monthB, yearB] = b.month.split("/")
        const dateA = new Date(Number.parseInt(yearA), Number.parseInt(monthA) - 1)
        const dateB = new Date(Number.parseInt(yearB), Number.parseInt(monthB) - 1)
        return dateA.getTime() - dateB.getTime()
      })
    }

    setChartData(processedData)
    setHasData(
      processedData.length > 0 &&
        (processedData.some((item) => item.ingresos > 0) || processedData.some((item) => item.gastos > 0)),
    )
  }, [data, historicalData])

  if (!hasData) {
    return (
      <EmptyState
        title="No hay datos para mostrar"
        description="No hay transacciones registradas para generar el gráfico de ingresos vs gastos."
      />
    )
  }

  // Limitar el número de puntos de datos en dispositivos móviles
  const displayData = isMobile && chartData.length > 3 ? chartData.slice(-3) : chartData

  return (
    <ResponsiveChartContainer>
      <ChartContainer
        config={{
          ingresos: {
            label: "Ingresos",
            color: "hsl(var(--chart-2))",
          },
          gastos: {
            label: "Gastos",
            color: "hsl(var(--chart-3))",
          },
        }}
        className="h-full w-full"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={displayData}
            margin={{
              top: 20,
              right: isMobile ? 10 : 30,
              left: isMobile ? 0 : 20,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fontSize: isMobile ? 10 : 12 }} interval={isMobile ? 0 : "preserveEnd"} />
            <YAxis
              tick={{ fontSize: isMobile ? 10 : 12 }}
              width={isMobile ? 40 : 60}
              tickFormatter={(value) => (isMobile ? `${value / 1000}k` : value.toLocaleString())}
            />
            <Tooltip
              formatter={(value: number) => [`$${value.toLocaleString()}`, ``]}
              labelFormatter={(name) => `Período: ${name}`}
            />
            <Legend wrapperStyle={{ fontSize: isMobile ? 10 : 12 }} />
            <Area
              type="monotone"
              dataKey="ingresos"
              name="Ingresos"
              stroke="hsl(var(--chart-2))"
              fill="hsl(var(--chart-2))"
              fillOpacity={0.3}
              stackId="1"
            />
            <Area
              type="monotone"
              dataKey="gastos"
              name="Gastos"
              stroke="hsl(var(--chart-3))"
              fill="hsl(var(--chart-3))"
              fillOpacity={0.3}
              stackId="2"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </ResponsiveChartContainer>
  )
}
