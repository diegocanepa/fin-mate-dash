"use client"

import { useState, useEffect } from "react"
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DateRangePicker } from "@/components/date-range-picker"
import type { CambioDivisas } from "@/lib/db"

interface ExchangeRateChartProps {
  data: CambioDivisas[]
}

export function ExchangeRateChart({ data }: ExchangeRateChartProps) {
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    // Procesar los datos para el gráfico
    const processedData = data
      .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
      .map((item) => ({
        date: new Date(item.fecha).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "2-digit" }),
        rate: item.precio_cambio,
        amount: item.cantidad,
        total: item.total,
      }))

    setChartData(processedData)
  }, [data])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Evolución del Tipo de Cambio USD/ARS</CardTitle>
          <CardDescription>Historial del precio de cambio a lo largo del tiempo</CardDescription>
        </div>
        <DateRangePicker />
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            rate: {
              label: "USD/ARS",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="aspect-[4/3] sm:aspect-[16/9]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" padding={{ left: 20, right: 20 }} tick={{ fontSize: 12 }} />
              <YAxis domain={["auto", "auto"]} tick={{ fontSize: 12 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
