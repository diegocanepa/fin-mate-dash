"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

// Datos de ejemplo - en producción vendrían de la API
const transactions = [
  {
    id: "1",
    type: "Gasto",
    description: "Supermercado",
    amount: -120.5,
    currency: "USD",
    date: "2023-08-15",
    category: "Comida",
  },
  {
    id: "2",
    type: "Ingreso",
    description: "Salario",
    amount: 3000,
    currency: "USD",
    date: "2023-08-01",
    category: "Salario",
  },
  {
    id: "3",
    type: "Inversión",
    description: "Compra ETF",
    amount: -500,
    currency: "USD",
    date: "2023-08-10",
    category: "ETFs",
  },
  {
    id: "4",
    type: "Cambio",
    description: "USD a ARS",
    amount: -200,
    currency: "USD",
    date: "2023-08-05",
    category: "Cambio",
  },
  {
    id: "5",
    type: "Transferencia",
    description: "Wise a Revolut",
    amount: -300,
    currency: "USD",
    date: "2023-08-03",
    category: "Transferencia",
  },
]

export function RecentTransactions() {
  return (
    <div className="space-y-8">
      {transactions.map((transaction) => (
        <div className="flex items-center" key={transaction.id}>
          <Avatar className="h-9 w-9">
            <AvatarFallback
              className={
                transaction.type === "Gasto"
                  ? "bg-red-100 text-red-600"
                  : transaction.type === "Ingreso"
                    ? "bg-green-100 text-green-600"
                    : transaction.type === "Inversión"
                      ? "bg-blue-100 text-blue-600"
                      : transaction.type === "Cambio"
                        ? "bg-purple-100 text-purple-600"
                        : "bg-gray-100 text-gray-600"
              }
            >
              {transaction.type.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{transaction.description}</p>
            <p className="text-sm text-muted-foreground">
              {new Date(transaction.date).toLocaleDateString()} · {transaction.category}
            </p>
          </div>
          <div className="ml-auto font-medium">
            <Badge variant={transaction.amount < 0 ? "destructive" : "default"}>
              {transaction.amount < 0 ? "-" : "+"}
              {Math.abs(transaction.amount).toFixed(2)} {transaction.currency}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  )
}
