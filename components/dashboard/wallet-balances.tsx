"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { SensitiveValue } from "@/components/ui/sensitive-value"
import { useVisibility } from "@/lib/visibility-context"
import type { Billetera } from "@/lib/db"

interface WalletBalancesProps {
  wallets: Billetera[]
}

export function WalletBalances({ wallets }: WalletBalancesProps) {
  const { isVisible } = useVisibility()

  // Transformar los datos de las billeteras para el gráfico
  const data = wallets.map((wallet) => ({
    name: wallet.name,
    value: isVisible ? wallet.balance : Math.random() * 1000 + 500, // Usar valores aleatorios cuando está oculto
  }))

  return (
    <ChartContainer
      config={{
        value: {
          label: "Saldo",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="aspect-[4/3] sm:aspect-[16/9]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
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
          <Tooltip
            content={({ active, payload }) => {
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
            }}
          />
          <Bar
            dataKey="value"
            fill="hsl(var(--chart-1))"
            radius={[4, 4, 0, 0]}
            label={{
              position: "top",
              formatter: (value: number) => {
                if (!isVisible) return "•••"
                return `$${value.toLocaleString()}`
              },
              fontSize: 12,
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
