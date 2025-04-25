"use client"

import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface PeriodEmptyStateProps {
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
  onResetFilter?: () => void
}

export function PeriodEmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  onResetFilter,
}: PeriodEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <CalendarIcon className="h-16 w-16 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-md mb-6">{description}</p>
      <div className="flex gap-4">
        {onResetFilter && (
          <Button variant="outline" onClick={onResetFilter}>
            Mostrar todos los datos
          </Button>
        )}
        {actionLabel && actionHref && (
          <Link href={actionHref}>
            <Button>{actionLabel}</Button>
          </Link>
        )}
      </div>
    </div>
  )
}
