"use client"

import { useState, useEffect } from "react"
import { Cell, Pie, PieChart, Legend, ResponsiveContainer, Tooltip } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { EmptyState } from "@/components/ui/empty-state"

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

interface ExpensesByCategoryChartProps {
  data: GastoIngreso[]
}

export function ExpensesByCategoryChart({ data }: ExpensesByCategoryChartProps) {
  const [chartData, setChartData] = useState<any[]>([])
  const [hasData, setHasData] = useState(false)

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
    const gastosPorCategoria = data.reduce(
      (acc, item) => {
        // Manejar tanto 'categoria' como 'category'
        const categoria = item.categoria || item.category || "Sin categoría"
        if (!acc[categoria]) {
          acc[categoria] = 0
        }
        acc[categoria] += item.amount
        return acc
      },
      {} as Record<string, number>,
    )

    // Convertir a array y ordenar de mayor a menor
    const processedData = Object.entries(gastosPorCategoria)
      .map(([name, value]) => ({
        name,
        value,
      }))
      .sort((a, b) => b.value - a.value)

    setChartData(processedData)
    setHasData(processedData.length > 0 && processedData.some((item) => item.value > 0))
  }, [data])

  if (!hasData) {
    return (
      <EmptyState
        title="No hay datos para mostrar"
        description="No hay gastos registrados para generar el gráfico de distribución por categoría."
      />
    )
  }

  // Calcular el total para los porcentajes
  const total = chartData.reduce((sum, item) => sum + item.value, 0)

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
                  {value}: {percentage}%
                </span>
              )
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
