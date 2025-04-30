"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart3, CreditCard, DollarSign, Home, PiggyBank, Wallet, Menu } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function MainNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

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
      {/* Versión móvil */}
      <div className="md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Abrir menú</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <div className="flex items-center mb-6">
              <img src="/images/finmate-logo.png" alt="FinMate Logo" className="w-8 h-8 mr-2" />
              <span className="text-lg font-bold">FinMate</span>
            </div>
            <div className="flex flex-col space-y-4 py-4">
              {routes.map((route) => {
                const Icon = route.icon
                return (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                      "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
                      route.active ? "bg-primary/10 text-primary" : "text-muted-foreground",
                    )}
                    onClick={() => setOpen(false)}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {route.label}
                  </Link>
                )
              })}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Versión desktop */}
      <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
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
    </>
  )
}
