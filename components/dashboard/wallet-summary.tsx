"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { SensitiveValue } from "@/components/ui/sensitive-value"
import type { Billetera, Transferencia } from "@/lib/db"

interface WalletSummaryProps {
  billeteras: Billetera[]
  transferencias: Transferencia[]
}

export function WalletSummary({ billeteras, transferencias }: WalletSummaryProps) {
  const [totalBalance, setTotalBalance] = useState(0)

  useEffect(() => {
    // Calcular el balance total
    const total = billeteras.reduce((sum, wallet) => sum + wallet.saldo, 0)
    setTotalBalance(total)
  }, [billeteras])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {billeteras.map((wallet) => {
        const percentage = totalBalance > 0 ? (wallet.saldo / totalBalance) * 100 : 0

        return (
          <Card key={wallet.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{wallet.nombre}</CardTitle>
              <div className="text-xs text-muted-foreground">{wallet.moneda}</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <SensitiveValue
                  value={wallet.saldo}
                  formatter={(value) =>
                    new Intl.NumberFormat("es-AR", {
                      style: "currency",
                      currency: wallet.moneda,
                    }).format(Number(value))
                  }
                />
              </div>
              <Progress value={percentage} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">{percentage.toFixed(1)}% del total</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
