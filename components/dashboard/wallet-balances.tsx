"use client"

import { useState } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { SensitiveValue } from "@/components/ui/sensitive-value"
import { useVisibility } from "@/lib/visibility-context"
import { useMediaQuery } from "@/hooks/use-media-query"
import { ResponsiveChartContainer } from "@/components/ui/responsive-chart-container"
import type { Billetera } from "@/lib/db"

interface WalletBalancesProps {
  wallets: Billetera[]
}

export function WalletBalances({ wallets }: WalletBalancesProps) {
  const { isVisible } = useVisibility()
  const isMobile = useMediaQuery("(max-width: 640px)")
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  // Transformar los datos de las billeteras para el gráfico
  const data = wallets.map((wallet) => ({
    name: wallet.name,
    value: isVisible ? wallet.balance : Math.random() * 1000 + 500, // Usar valores aleatorios cuando está oculto
    originalValue: wallet.balance,
  }))

  // Ordenar los datos de mayor a menor para mejor visualización
  const sortedData = [...data].sort((a, b) => b.value - a.value)

  // Colores para el gráfico
  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
    "hsl(var(--chart-6))",
  ]

  const handlePieEnter = (_: any, index: number) => {
    setActiveIndex(index)
  }

  const handlePieLeave = () => {
    setActiveIndex(null)
  }

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    if (!isVisible) return null

    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    // Solo mostrar etiquetas para segmentos grandes (más del 10%)
    if (percent < 0.1) return null

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" fontSize={12}>
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  const renderTooltipContent = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col">
              <span className="text-[0.70rem] uppercase text-muted-foreground">Billetera</span>
              <span className="font-bold text-muted-foreground">{payload[0].payload.name}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[0.70rem] uppercase text-muted-foreground">Saldo</span>
              <span className="font-bold">
                <SensitiveValue
                  value={payload[0].payload.originalValue || payload[0].value}
                  formatter={(val) => `$${Number(val).toLocaleString()}`}
                />
              </span>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  // Renderizador personalizado para la leyenda
  const renderCustomLegend = (props: any) => {
    const { payload } = props

    return (
      <ul className="flex flex-wrap justify-center gap-2 mt-4 text-xs">
        {payload.map((entry: any, index: number) => (
          <li key={`item-${index}`} className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
            <span>{entry.value}</span>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <ResponsiveChartContainer
      mobileAspectRatio="aspect-square"
      aspectRatio="aspect-[16/9]"
      mobileMinHeight="min-h-[300px]"
      minHeight="min-h-[400px]"
    >
      <ChartContainer
        config={sortedData.reduce(
          (acc, item, index) => {
            acc[item.name] = {
              label: item.name,
              color: COLORS[index % COLORS.length],
            }
            return acc
          },
          {} as Record<string, { label: string; color: string }>,
        )}
        className="h-full w-full"
      >
        <ResponsiveContainer width="100%" height="100%">
          {isMobile ? (
            // Gráfico de pastel para móviles
            <PieChart>
              <Pie
                data={sortedData}
                cx="50%"
                cy="45%" // Ajustado para dejar espacio para la leyenda
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={100} // Reducido para dejar espacio para la leyenda
                fill="#8884d8"
                dataKey="value"
                onMouseEnter={handlePieEnter}
                onMouseLeave={handlePieLeave}
              >
                {sortedData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke={activeIndex === index ? "#fff" : "transparent"}
                    strokeWidth={activeIndex === index ? 2 : 0}
                  />
                ))}
              </Pie>
              <Tooltip content={renderTooltipContent} />
              <Legend content={renderCustomLegend} />
            </PieChart>
          ) : (
            // Gráfico de barras para pantallas más grandes
            <BarChart
              data={sortedData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={isVisible ? ["auto", "auto"] : [0, 5000]} />
              <Tooltip content={renderTooltipContent} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {sortedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </ChartContainer>
    </ResponsiveChartContainer>
  )
}
