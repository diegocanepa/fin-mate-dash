"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart3, CreditCard, DollarSign, Home, PiggyBank, Wallet } from "lucide-react"

export function MainNav() {
  const pathname = usePathname()

  const routes = [
    {
      href: "/",
      label: "Dashboard",
      icon: Home,
      active: pathname === "/",
    },
    {
      href: "/gastos",
      label: "Gastos",
      icon: CreditCard,
      active: pathname === "/gastos",
    },
    {
      href: "/inversiones",
      label: "Inversiones",
      icon: BarChart3,
      active: pathname === "/inversiones",
    },
    {
      href: "/cambio-divisas",
      label: "Cambio de Divisas",
      icon: DollarSign,
      active: pathname === "/cambio-divisas",
    },
    {
      href: "/billeteras",
      label: "Billeteras",
      icon: Wallet,
      active: pathname === "/billeteras",
    },
    {
      href: "/agregar",
      label: "Agregar",
      icon: PiggyBank,
      active: pathname === "/agregar",
    },
  ]

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {routes.map((route) => {
        const Icon = route.icon
        return (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center text-sm font-medium transition-colors hover:text-primary",
              route.active ? "text-primary" : "text-muted-foreground",
            )}
          >
            <Icon className="mr-2 h-4 w-4" />
            {route.label}
          </Link>
        )
      })}
    </nav>
  )
}

