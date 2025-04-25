"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { ChartContainer } from "@/components/ui/chart"

interface InvestmentItem {
  id: string
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

  // Renderizador personalizado para las etiquetas
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    // Solo mostrar etiquetas para segmentos grandes (más del 5%)
    if (percent < 0.05) return null

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" fontSize={10}>
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    )
  }

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
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={renderCustomizedLabel}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [`$${value.toLocaleString()}`, `Valor`]}
            labelFormatter={(name) =>
              `${name} (${(((chartData.find((item) => item.name === name)?.value || 0) / total) * 100).toFixed(1)}%)`
            }
          />
          <Legend
            layout="vertical"
            verticalAlign="middle"
            align="right"
            formatter={(value, entry, index) => {
              const item = chartData.find((d) => d.name === value)
              const percentage = item ? ((item.value / total) * 100).toFixed(1) : "0.0"
              return (
                <span style={{ fontSize: "0.75rem" }}>
                  {value.length > 15 ? `${value.substring(0, 15)}...` : value}: {percentage}%
                </span>
              )
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
