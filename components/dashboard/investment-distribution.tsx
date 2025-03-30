"use client"

import { Cell, Pie, PieChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Datos de ejemplo - en producción vendrían de la API
const data = [
  { name: "Acciones", value: 400 },
  { name: "Bonos", value: 300 },
  { name: "Cripto", value: 300 },
  { name: "ETFs", value: 200 },
]

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"]

export function InvestmentDistribution() {
  return (
    <ChartContainer
      config={{
        Acciones: {
          label: "Acciones",
          color: COLORS[0],
        },
        Bonos: {
          label: "Bonos",
          color: COLORS[1],
        },
        Cripto: {
          label: "Cripto",
          color: COLORS[2],
        },
        ETFs: {
          label: "ETFs",
          color: COLORS[3],
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

