"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Cell, Pie, PieChart, ResponsiveContainer, Legend } from "recharts"
import { getDistributionData } from "@/lib/investment-data"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export function DistributionChart() {
  const data = getDistributionData()

  const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"]

  const categoryLabels: Record<string, string> = {
    acciones: "Acciones",
    cedear: "CEDEARs",
    bono: "Bonos",
    criptomonedas: "Criptomonedas",
  }

  // Formatear los datos para mostrar nombres más amigables
  const formattedData = data.map((item) => ({
    ...item,
    name: categoryLabels[item.name] || item.name,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribución de Inversiones</CardTitle>
        <CardDescription>Distribución por categoría de inversión</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ChartContainer
          config={formattedData.reduce(
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
                data={formattedData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {formattedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
