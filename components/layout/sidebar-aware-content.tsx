"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import { useSidebar } from "@/lib/sidebar-context"

export function SidebarAwareContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar()

  return (
    <div
      className={cn("flex flex-col flex-1 transition-all duration-300", isCollapsed ? "lg:ml-[80px]" : "lg:ml-[280px]")}
    >
      {children}
    </div>
  )
}
