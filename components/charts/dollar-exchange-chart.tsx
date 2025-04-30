"use client"

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { EmptyState } from "@/components/ui/empty-state"
import { SensitiveValue } from "@/components/ui/sensitive-value"
import { useVisibility } from "@/lib/visibility-context"
import { useMediaQuery } from "@/hooks/use-media-query"
import { ResponsiveChartContainer } from "@/components/ui/responsive-chart-container"

interface DollarExchangeChartProps {
  data: Array<{
    date: string
    amount: number
  }>
}

export function DollarExchangeChart({ data }: DollarExchangeChartProps) {
  const { isVisible } = useVisibility()
  const isMobile = useMediaQuery("(max-width: 640px)")

  if (!data || data.length === 0) {
    return (
      <EmptyState
        title="No hay datos para mostrar"
        description="No hay operaciones de cambio de divisas registradas."
      />
    )
  }

  // Limitar el número de puntos de datos en dispositivos móviles
  const displayData = isMobile && data.length > 4 ? data.slice(-4) : data

  return (
    <ResponsiveChartContainer>
      <ChartContainer
        config={{
          amount: {
            label: "USD Cambiados",
            color: "hsl(var(--chart-2))",
          },
        }}
        className="h-full w-full"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
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
            <YAxis
              tick={{ fontSize: isMobile ? 10 : 12 }}
              width={isMobile ? 40 : 60}
              tickFormatter={(value) => (isMobile ? `${value / 1000}k` : value.toLocaleString())}
            />
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
                          <span className="text-[0.70rem] uppercase text-muted-foreground">USD Cambiados</span>
                          <span className="font-bold">
                            <SensitiveValue
                              value={payload[0].value}
                              formatter={(val) => `$${Number(val).toLocaleString()}`}
                            />
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="hsl(var(--chart-2))"
              fill="hsl(var(--chart-2))"
              fillOpacity={0.3}
              label={
                isMobile
                  ? null
                  : {
                      position: "top",
                      formatter: (value: number) => {
                        if (!isVisible) return "•••"
                        return `$${value.toLocaleString()}`
                      },
                      fontSize: 12,
                      fill: "hsl(var(--chart-2))",
                      offset: 10,
                    }
              }
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </ResponsiveChartContainer>
  )
}
