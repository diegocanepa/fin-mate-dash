"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface CurrencyExchangeRatesProps {
  data?: any[]
}

export function CurrencyExchangeRates({ data = [] }: CurrencyExchangeRatesProps) {
  // Usar los datos proporcionados o datos de ejemplo si no hay datos
  const chartData =
    data.length > 0
      ? data.map((item) => ({
          date: new Date(item.date).toLocaleDateString("es-AR", { month: "numeric", year: "numeric" }),
          rate: item.price || item.exchange_rate,
        }))
      : [
          { date: "1/2023", rate: 950 },
          { date: "2/2023", rate: 980 },
          { date: "3/2023", rate: 1020 },
          { date: "4/2023", rate: 1050 },
          { date: "5/2023", rate: 1080 },
          { date: "6/2023", rate: 1100 },
          { date: "7/2023", rate: 1120 },
          { date: "8/2023", rate: 1150 },
        ]

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
        data={chartData}
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

