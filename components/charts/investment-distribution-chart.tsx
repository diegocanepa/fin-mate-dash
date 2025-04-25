"use client"

import { useState, useEffect } from "react"
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Inversion } from "@/lib/db"

interface InvestmentDistributionChartProps {
  data: Inversion[]
}

export function InvestmentDistributionChart({ data }: InvestmentDistributionChartProps) {
  const [chartData, setChartData] = useState<any[]>([])

  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
    "hsl(var(--chart-6))",
  ]

  useEffect(() => {
    // Procesar los datos para el gráfico
    const inversionesPorCategoria = data
      .filter((item) => item.accion === "Compra")
      .reduce(
        (acc, item) => {
          const categoria = item.categoria
          if (!acc[categoria]) {
            acc[categoria] = 0
          }
          acc[categoria] += item.cantidad * item.precio_unidad
          return acc
        },
        {} as Record<string, number>,
      )

    const processedData = Object.entries(inversionesPorCategoria).map(([name, value]) => ({
      name,
      value,
    }))

    setChartData(processedData)
  }, [data])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribución de Inversiones</CardTitle>
        <CardDescription>Distribución por categoría de inversión</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartData.reduce(
            (acc, item, index) => {
              acc[item.name] = {
                label: item.name,
                color: COLORS[index % COLORS.length],
              }
              return acc
            },
            {} as Record<string, { label: string; color: string }>,
          )}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
