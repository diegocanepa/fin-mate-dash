"use client"

import { useState, useEffect } from "react"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { EmptyState } from "@/components/ui/empty-state"

interface GastoIngreso {
  id: number
  fecha: string
  accion: string
  amount: number
  moneda: string
  categoria: string
  descripcion: string
}

interface IncomeVsExpensesChartProps {
  data: GastoIngreso[]
}

export function IncomeVsExpensesChart({ data }: IncomeVsExpensesChartProps) {
  const [chartData, setChartData] = useState<any[]>([])
  const [hasData, setHasData] = useState(false)

  useEffect(() => {
    // Agrupar datos por mes
    const groupedByMonth = data.reduce(
      (acc, item) => {
        const date = new Date(item.fecha)
        const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`

        if (!acc[monthYear]) {
          acc[monthYear] = {
            month: monthYear,
            ingresos: 0,
            gastos: 0,
          }
        }

        if (item.accion === "Ingreso") {
          acc[monthYear].ingresos += item.amount
        } else if (item.accion === "Gasto") {
          acc[monthYear].gastos += item.amount
        }

        return acc
      },
      {} as Record<string, { month: string; ingresos: number; gastos: number }>,
    )

    // Convertir a array y ordenar por fecha
    const processedData = Object.values(groupedByMonth)
    processedData.sort((a, b) => {
      const [monthA, yearA] = a.month.split("/")
      const [monthB, yearB] = b.month.split("/")
      const dateA = new Date(Number.parseInt(yearA), Number.parseInt(monthA) - 1)
      const dateB = new Date(Number.parseInt(yearB), Number.parseInt(monthB) - 1)
      return dateA.getTime() - dateB.getTime()
    })

    setChartData(processedData)
    setHasData(
      processedData.length > 0 &&
        (processedData.some((item) => item.ingresos > 0) || processedData.some((item) => item.gastos > 0)),
    )
  }, [data])

  if (!hasData) {
    return (
      <EmptyState
        title="No hay datos para mostrar"
        description="No hay transacciones registradas para generar el gráfico de ingresos vs gastos."
      />
    )
  }

  return (
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
      className="aspect-[4/3] sm:aspect-[16/9]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
          <Bar dataKey="ingresos" name="Ingresos" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
          <Bar dataKey="gastos" name="Gastos" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

