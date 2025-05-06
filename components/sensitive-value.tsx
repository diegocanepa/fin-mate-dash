"use client"

import type React from "react"

import { useVisibility } from "@/lib/visibility-context"

interface SensitiveValueProps {
  children: React.ReactNode
  className?: string
}

export function SensitiveValue({ children, className }: SensitiveValueProps) {
  const { isVisible } = useVisibility()

  return (
    <span className={className}>
      {isVisible ? (
        children
      ) : (
        <span className="select-none blur-sm hover:blur-none transition-all duration-200">{children}</span>
      )}
    </span>
  )
}
