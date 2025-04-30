"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"

interface ResponsiveChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  aspectRatio?: string
  mobileAspectRatio?: string
  minHeight?: string
  mobileMinHeight?: string
}

export function ResponsiveChartContainer({
  children,
  className,
  aspectRatio = "aspect-[16/9]",
  mobileAspectRatio = "aspect-[4/3]",
  minHeight = "min-h-[300px]",
  mobileMinHeight = "min-h-[200px]",
  ...props
}: ResponsiveChartContainerProps) {
  const isMobile = useMediaQuery("(max-width: 640px)")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className={cn("w-full rounded-md border bg-muted/20 p-2", aspectRatio, minHeight, className)} {...props} />
    )
  }

  return (
    <div
      className={cn(
        "w-full rounded-md border bg-muted/20 p-2",
        isMobile ? mobileAspectRatio : aspectRatio,
        isMobile ? mobileMinHeight : minHeight,
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
