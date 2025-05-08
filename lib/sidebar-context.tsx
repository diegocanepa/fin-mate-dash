"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

type SidebarContextType = {
  isCollapsed: boolean
  toggleSidebar: () => void
  setCollapsed: (collapsed: boolean) => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Inicializar desde localStorage si está disponible
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("sidebar-collapsed")
      if (stored !== null) {
        setIsCollapsed(stored === "true")
      }
    }
  }, [])

  // Guardar en localStorage cuando cambia
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebar-collapsed", isCollapsed.toString())
    }
  }, [isCollapsed])

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  const setCollapsed = (collapsed: boolean) => {
    setIsCollapsed(collapsed)
  }

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleSidebar, setCollapsed }}>{children}</SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}
