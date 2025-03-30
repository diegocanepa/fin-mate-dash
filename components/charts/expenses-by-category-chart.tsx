"use client"

import { useState, useEffect } from "react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MonthSelector } from "@/components/month-selector"
import type { GastoIngreso } from "@/lib/db"

interface ExpensesByCategoryChartProps {
  data: GastoIngreso[]
}

export function ExpensesByCategoryChart({ data }: ExpensesByCategoryChartProps) {
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    // Procesar los datos para el gráfico
    const gastosPorCategoria = data
      .filter((item) => item.accion === "Gasto")
      .reduce(
        (acc, item) => {
          const categoria = item.categoria
          if (!acc[categoria]) {
            acc[categoria] = 0
          }
          acc[categoria] += item.amount
          return acc
        },
        {} as Record<string, number>,
      )

    const processedData = Object.entries(gastosPorCategoria).map(([categoria, amount]) => ({
      categoria,
      amount,
    }))

    // Ordenar de mayor a menor
    processedData.sort((a, b) => b.amount - a.amount)

    setChartData(processedData)
  }, [data])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Gastos por Categoría</CardTitle>
          <CardDescription>Distribución de gastos por categoría</CardDescription>
        </div>
        <MonthSelector />
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            amount: {
              label: "Monto",
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
              <XAxis dataKey="categoria" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="amount" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

