"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { getPortfolioEvolutionData } from "@/lib/investment-data"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export function PortfolioEvolution() {
  const data = getPortfolioEvolutionData()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolución de Cartera</CardTitle>
        <CardDescription>Valor total de inversiones a lo largo del tiempo</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ChartContainer
          config={{
            value: {
              label: "Valor Total",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-full w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tickFormatter={(value) => {
                  const [year, month] = value.split("-")
                  return `${month}/${year.substring(2)}`
                }}
              />
              <YAxis
                tickFormatter={(value) =>
                  new Intl.NumberFormat("es-AR", {
                    notation: "compact",
                    compactDisplay: "short",
                    maximumFractionDigits: 1,
                  }).format(value)
                }
              />
              <CartesianGrid strokeDasharray="3 3" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--chart-1))"
                fillOpacity={1}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
