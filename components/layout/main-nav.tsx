"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  BarChart3,
  CreditCard,
  DollarSign,
  Home,
  PiggyBank,
  Wallet,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Image from "next/image"
import { ThemeToggle } from "@/components/theme-toggle"
import { VisibilityToggle } from "@/components/visibility-toggle"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useSidebar } from "@/lib/sidebar-context"

export function MainNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { isCollapsed, toggleSidebar } = useSidebar()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

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
    {
      href: "/vincular-telegram",
      label: "Vincular Telegram",
      icon: Menu, // Cambiado a un icono simple para evitar problemas
      active: pathname === "/vincular-telegram",
    },
  ]

  // Versión móvil
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Abrir menú</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-[280px]">
          <div className="space-y-4 py-4">
            <div className="px-4 py-2 flex items-center border-b">
              <Image src="/images/finmate-logo.png" alt="FinMate Logo" width={32} height={32} className="mr-2" />
              <span className="text-lg font-bold">FinMate</span>
              <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="px-3 py-2 space-y-1">
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
                    onClick={() => setOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{route.label}</span>
                  </Link>
                )
              })}
            </div>
            <div className="px-3 pt-2 border-t flex items-center justify-between">
              <div className="flex items-center gap-2">
                <VisibilityToggle />
                <ThemeToggle />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  // Versión desktop
  return (
    <div
      className={cn(
        "hidden lg:flex lg:flex-col h-screen border-r bg-background fixed transition-all duration-300 z-10",
        isCollapsed ? "w-[80px]" : "w-[280px]",
      )}
    >
      <div className="flex h-14 items-center border-b px-4">
        {isCollapsed ? (
          <div className="flex w-full justify-between items-center">
            <Image src="/images/finmate-logo.png" alt="FinMate Logo" width={32} height={32} />
            <Button variant="ghost" size="icon" onClick={toggleSidebar} aria-label="Expandir sidebar">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        ) : (
          <>
            <Image src="/images/finmate-logo.png" alt="FinMate Logo" width={32} height={32} className="mr-2" />
            <span className="text-lg font-bold">FinMate</span>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto"
              onClick={toggleSidebar}
              aria-label="Colapsar sidebar"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </>
        )}
      </div>
      <div className="flex-1 overflow-auto py-4 px-4">
        <nav className="flex flex-col gap-1">
          <TooltipProvider>
            {routes.map((route) => {
              const Icon = route.icon
              return isCollapsed ? (
                <Tooltip key={route.href} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Link
                      href={route.href}
                      className={cn(
                        "flex items-center justify-center rounded-lg p-3 text-sm transition-all hover:bg-accent",
                        route.active ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground",
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="sr-only">{route.label}</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">{route.label}</TooltipContent>
                </Tooltip>
              ) : (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                    route.active ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground",
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{route.label}</span>
                </Link>
              )
            })}
          </TooltipProvider>
        </nav>
      </div>
      <div
        className={cn(
          "border-t py-4 px-4",
          isCollapsed ? "flex flex-col items-center gap-4" : "flex items-center justify-between",
        )}
      >
        <VisibilityToggle />
        <ThemeToggle />
      </div>
    </div>
  )
}
