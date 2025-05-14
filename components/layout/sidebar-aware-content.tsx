"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { useSidebar } from "@/lib/sidebar-context"
import { useTelegram } from "@/lib/telegram-context"
import { usePathname } from "next/navigation"

export function SidebarAwareContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar()
  const { isLinked } = useTelegram()
  const pathname = usePathname()

  // Determinar si estamos en la página de vinculación de Telegram
  const isTelegramPage = pathname === "/vincular-telegram"

  // Si estamos en la página de vinculación y no está vinculado, no aplicar margen
  const shouldApplyMargin = !(isTelegramPage && !isLinked)

  return (
    <div
      className={cn(
        "flex flex-col flex-1 transition-all duration-300",
        shouldApplyMargin && (isCollapsed ? "lg:ml-[80px]" : "lg:ml-[280px]"),
      )}
    >
      {children}
    </div>
  )
}
