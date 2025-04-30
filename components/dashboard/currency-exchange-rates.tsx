"use client"

import { Line, LineChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { EmptyState } from "@/components/ui/empty-state"
import { useMediaQuery } from "@/hooks/use-media-query"
import { ResponsiveChartContainer } from "@/components/ui/responsive-chart-container"

interface CurrencyExchangeRatesProps {
  data: Array<{
    date: string
    rate: number
  }>
}

export function CurrencyExchangeRates({ data }: CurrencyExchangeRatesProps) {
  const isMobile = useMediaQuery("(max-width: 640px)")

  if (!data || data.length === 0) {
    return <EmptyState title="No hay datos para mostrar" description="No hay datos de tipo de cambio disponibles." />
  }

  // Limitar el número de puntos de datos en dispositivos móviles
  const displayData = isMobile && data.length > 4 ? data.slice(-4) : data

  return (
    <ResponsiveChartContainer>
      <ChartContainer
        config={{
          rate: {
            label: "Tipo de Cambio",
            color: "hsl(var(--chart-1))",
          },
        }}
        className="h-full w-full"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={displayData}
            margin={{
              top: 20,
              right: isMobile ? 10 : 30,
              left: isMobile ? 0 : 20,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: isMobile ? 10 : 12 }} interval={isMobile ? 0 : "preserveEnd"} />
            <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} width={isMobile ? 40 : 60} domain={["auto", "auto"]} />
            <ChartTooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">Fecha</span>
                          <span className="font-bold text-muted-foreground">{payload[0].payload.date}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">Tipo de Cambio</span>
                          <span className="font-bold">{payload[0].value.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Line
              type="monotone"
              dataKey="rate"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              dot={{ r: isMobile ? 3 : 4 }}
              activeDot={{ r: isMobile ? 5 : 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </ResponsiveChartContainer>
  )
}
