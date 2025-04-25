"use client"

import { Cell, Pie, PieChart, Legend, Tooltip } from "recharts"
import { ChartContainer } from "@/components/ui/chart"

// Datos de ejemplo - en producción vendrían de la API
const data = [
  { name: "Comida", value: 400 },
  { name: "Transporte", value: 300 },
  { name: "Ocio", value: 300 },
  { name: "Vivienda", value: 200 },
  { name: "Otros", value: 100 },
]

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
]

export function ExpensesByCategory() {
  // Calcular el total para los porcentajes
  const total = data.reduce((sum, item) => sum + item.value, 0)

  // Añadir porcentajes a los datos
  const dataWithPercentages = data.map((item) => ({
    ...item,
    percentage: ((item.value / total) * 100).toFixed(1),
  }))

  // Renderizador personalizado para las etiquetas
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" fontSize={12}>
        {`${name} (${(percent * 100).toFixed(1)}%)`}
      </text>
    )
  }

  return (
    <ChartContainer
      config={{
        Comida: {
          label: "Comida",
          color: COLORS[0],
        },
        Transporte: {
          label: "Transporte",
          color: COLORS[1],
        },
        Ocio: {
          label: "Ocio",
          color: COLORS[2],
        },
        Vivienda: {
          label: "Vivienda",
          color: COLORS[3],
        },
        Otros: {
          label: "Otros",
          color: COLORS[4],
        },
      }}
      className="h-[300px]"
    >
      <PieChart>
        <Pie
          data={dataWithPercentages}
          cx="50%"
          cy="50%"
          labelLine={true}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          label={renderCustomizedLabel}
        >
          {dataWithPercentages.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name, props) => [`$${value.toLocaleString()}`, `${name} (${props.payload.percentage}%)`]}
        />
        <Legend
          layout="vertical"
          verticalAlign="middle"
          align="right"
          formatter={(value, entry, index) => (
            <span style={{ color: COLORS[index % COLORS.length] }}>
              {value}: {dataWithPercentages[index].percentage}%
            </span>
          )}
        />
      </PieChart>
    </ChartContainer>
  )
}
