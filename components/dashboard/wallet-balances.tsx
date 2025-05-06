"use client"

import { useState, useEffect } from "react"
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
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
  const [chartKey, setChartKey] = useState(Date.now())

  // Efecto para forzar la actualización del gráfico cuando cambia la visibilidad
  useEffect(() => {
    // Generar una nueva key para forzar el re-render del gráfico
    setChartKey(Date.now())

    // Forzar un redimensionamiento después de un breve retraso
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event("resize"))
    }, 100)

    return () => clearTimeout(timer)
  }, [isVisible])

  // Transformar los datos de las billeteras para el gráfico
  const data = wallets.map((wallet) => ({
    name: wallet.name,
    value: isVisible ? wallet.balance : Math.random() * 1000 + 500, // Usar valores aleatorios cuando está oculto
    originalValue: wallet.balance,
    displayValue: isVisible ? `$${wallet.balance.toLocaleString()}` : "•••••",
  }))

  // Ordenar los datos de mayor a menor para mejor visualización
  const sortedData = [...data].sort((a, b) => b.value - a.value)

  // Colores para el gráfico
  const COLORS = [
    "#6FB3B8", // Primario suave
    "#F3C87B", // Secundario pastel
    "#A3D9A5", // Éxito / positivo
    "#F28B82", // Advertencia / negativo
    "#556873", // Gris medio
    "#1E2A33", // Azul grisáceo
  ]

  const handleBarEnter = (_: any, index: number) => {
    setActiveIndex(index)
  }

  const handleBarLeave = () => {
    setActiveIndex(null)
  }

  const renderTooltipContent = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col">
              <span className="text-[0.70rem] uppercase text-muted-foreground">Billetera</span>
              <span className="font-bold text-foreground">{payload[0].payload.name}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[0.70rem] uppercase text-muted-foreground">Saldo</span>
              <span className="font-bold">
                <SensitiveValue
                  value={payload[0].payload.originalValue}
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

  return (
    <div className="w-full overflow-hidden">
      <ResponsiveChartContainer
        key={chartKey}
        mobileAspectRatio="aspect-[4/3]"
        aspectRatio="aspect-[16/9]"
        mobileMinHeight="min-h-[350px]"
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
              // Gráfico de barras horizontales para móvil
              <BarChart
                data={sortedData}
                layout="horizontal"
                margin={{
                  top: 20,
                  right: 20,
                  left: 20,
                  bottom: 20,
                }}
                onMouseEnter={handleBarEnter}
                onMouseLeave={handleBarLeave}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                <XAxis
                  type="number"
                  domain={isVisible ? [0, "auto"] : [0, 5000]}
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                  tick={{ fontSize: 10 }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={70}
                  tick={{ fontSize: 10 }}
                  tickFormatter={(value) => (value.length > 8 ? `${value.substring(0, 8)}...` : value)}
                />
                <Tooltip content={renderTooltipContent} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {sortedData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke={activeIndex === index ? "#fff" : "transparent"}
                      strokeWidth={activeIndex === index ? 2 : 0}
                    />
                  ))}
                </Bar>
              </BarChart>
            ) : (
              // Gráfico de barras verticales para escritorio
              <BarChart
                data={sortedData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 60,
                }}
                onMouseEnter={handleBarEnter}
                onMouseLeave={handleBarLeave}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                <XAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 12, angle: -45, textAnchor: "end" }}
                  height={60}
                  tickFormatter={(value) => (value.length > 15 ? `${value.substring(0, 15)}...` : value)}
                />
                <YAxis
                  type="number"
                  domain={isVisible ? [0, "auto"] : [0, 5000]}
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                />
                <Tooltip content={renderTooltipContent} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {sortedData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke={activeIndex === index ? "#fff" : "transparent"}
                      strokeWidth={activeIndex === index ? 2 : 0}
                    />
                  ))}
                </Bar>
              </BarChart>
            )}
          </ResponsiveContainer>
        </ChartContainer>
      </ResponsiveChartContainer>
    </div>
  )
}
