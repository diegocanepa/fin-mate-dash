"use client"

import { useVisibility } from "@/lib/visibility-context"

interface SensitiveValueProps {
  value: string | number
  className?: string
  formatter?: (value: string | number) => string
  placeholder?: string
}

export function SensitiveValue({ value, className, formatter, placeholder = "••••••" }: SensitiveValueProps) {
  const { isVisible } = useVisibility()

  const displayValue = formatter ? formatter(value) : value

  return <span className={className}>{isVisible ? displayValue : placeholder}</span>
}
