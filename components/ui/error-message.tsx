"use client"

import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

interface ErrorMessageProps {
  title: string
  description: string
  retry?: () => void
}

export function ErrorMessage({ title, description, retry }: ErrorMessageProps) {
  return (
    <Alert variant="destructive" className="my-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        {description}
        {retry && (
          <div className="mt-2">
            <Button variant="outline" size="sm" onClick={retry}>
              Reintentar
            </Button>
          </div>
        )}
      </AlertDescription>
    </Alert>
  )
}

