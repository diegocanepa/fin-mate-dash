"use client"

import { Cell, Pie, PieChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

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
        <Pie data={data} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <ChartTooltip content={<ChartTooltipContent />} />
      </PieChart>
    </ChartContainer>
  )
}

