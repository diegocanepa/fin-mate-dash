"use client"

import { useState, useEffect } from "react"
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useMediaQuery } from "@/hooks/use-media-query"
import { ResponsiveChartContainer } from "@/components/ui/responsive-chart-container"
import type { Inversion } from "@/lib/db"

interface InvestmentDistributionChartProps {
  data: Inversion[]
}

export function InvestmentDistributionChart({ data }: InvestmentDistributionChartProps) {
  const [chartData, setChartData] = useState<any[]>([])
  const isMobile = useMediaQuery("(max-width: 640px)")

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

    // Convertir a array y ordenar de mayor a menor
    let processedData = Object.entries(inversionesPorCategoria)
      .map(([name, value]) => ({
        name,
        value,
      }))
      .sort((a, b) => b.value - a.value)

    // En móvil, limitar a las 4 categorías principales y agrupar el resto
    if (isMobile && processedData.length > 4) {
      const topCategories = processedData.slice(0, 3)
      const otherCategories = processedData.slice(3)
      const otherValue = otherCategories.reduce((sum, item) => sum + item.value, 0)

      processedData = [...topCategories, { name: "Otros", value: otherValue }]
    }

    setChartData(processedData)
  }, [data, isMobile])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribución de Inversiones</CardTitle>
        <CardDescription>Distribución por categoría de inversión</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveChartContainer mobileAspectRatio="aspect-square" mobileMinHeight="min-h-[250px]">
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
            className="h-full w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={isMobile ? 60 : 80}
                  fill="#8884d8"
                  dataKey="value"
                  label={
                    isMobile
                      ? null
                      : {
                          position: "outside",
                          formatter: (value, entry, index) => {
                            const item = chartData[index]
                            const total = chartData.reduce((sum, item) => sum + item.value, 0)
                            const percent = ((item.value / total) * 100).toFixed(0)
                            return percent > 5 ? `${percent}%` : ""
                          },
                        }
                  }
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </ResponsiveChartContainer>
      </CardContent>
    </Card>
  )
}
