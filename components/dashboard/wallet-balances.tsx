"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import type { Billetera } from "@/lib/db"

interface WalletBalancesProps {
  wallets: Billetera[]
}

export function WalletBalances({ wallets }: WalletBalancesProps) {
  // Transformar los datos de las billeteras para el gráfico
  const data = wallets.map((wallet) => ({
    name: wallet.name,
    value: wallet.balance,
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
          <YAxis />
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
                        <span className="font-bold">${payload[0].value?.toLocaleString()}</span>
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
              formatter: (value: number) => `$${value.toLocaleString()}`,
              fontSize: 12,
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

