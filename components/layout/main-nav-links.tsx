"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart3, CreditCard, DollarSign, Home, PiggyBank, Wallet } from "lucide-react"

interface MainNavLinksProps {
  onClick?: () => void
}

export function MainNavLinks({ onClick }: MainNavLinksProps) {
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
    <>
      {routes.map((route) => {
        const Icon = route.icon
        return (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
              route.active ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground",
            )}
            onClick={onClick}
          >
            <Icon className="h-5 w-5" />
            <span>{route.label}</span>
          </Link>
        )
      })}
    </>
  )
}
