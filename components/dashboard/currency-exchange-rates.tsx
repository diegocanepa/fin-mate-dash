"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Datos de ejemplo - en producción vendrían de la API
const data = [
  { date: "2023-01", rate: 950 },
  { date: "2023-02", rate: 980 },
  { date: "2023-03", rate: 1020 },
  { date: "2023-04", rate: 1050 },
  { date: "2023-05", rate: 1080 },
  { date: "2023-06", rate: 1100 },
  { date: "2023-07", rate: 1120 },
  { date: "2023-08", rate: 1150 },
]

export function CurrencyExchangeRates() {
  return (
    <ChartContainer
      config={{
        rate: {
          label: "USD/ARS",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="aspect-[4/3] sm:aspect-[16/9]"
    >
      <LineChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line type="monotone" dataKey="rate" stroke="hsl(var(--chart-1))" strokeWidth={2} />
      </LineChart>
    </ChartContainer>
  )
}

