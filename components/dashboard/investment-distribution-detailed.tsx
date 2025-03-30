"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { ChartContainer } from "@/components/ui/chart"

interface InvestmentItem {
  id: number
  nombre: string
  categoria: string
  valor_total: number
  moneda: string
}

interface InvestmentDistributionDetailedProps {
  data: InvestmentItem[]
}

export function InvestmentDistributionDetailed({ data }: InvestmentDistributionDetailedProps) {
  // Colores para el gráfico
  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
    "hsl(var(--chart-6))",
    "hsl(var(--chart-7))",
    "hsl(var(--chart-8))",
  ]

  // Preparar datos para el gráfico
  const chartData = data.map((item) => ({
    name: item.nombre,
    value: item.valor_total,
  }))

  // Calcular el total para porcentajes
  const total = data.reduce((sum, item) => sum + item.valor_total, 0)

  return (
    <ChartContainer
      config={data.reduce(
        (acc, item, index) => {
          acc[item.nombre] = {
            label: item.nombre,
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
          <Tooltip
            formatter={(value: number) => [`$${value.toLocaleString()}`, "Valor"]}
            labelFormatter={(name) =>
              `${name} (${(((chartData.find((item) => item.name === name)?.value || 0) / total) * 100).toFixed(1)}%)`
            }
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

