"use client"

import { useEffect, useState } from "react"
import { Database } from "lucide-react"
import { ENVIRONMENT } from "@/lib/supabase"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function SchemaIndicator() {
  const [schema, setSchema] = useState<string | null>(null)
  const [environment, setEnvironment] = useState<string | null>(null)

  useEffect(() => {
    // Obtener el esquema del localStorage o de las variables de entorno
    const storedSchema = typeof window !== "undefined" ? window.localStorage.getItem("NEXT_PUBLIC_DB_SCHEMA") : null
    const envSchema = process.env.NEXT_PUBLIC_DB_SCHEMA || null
    setSchema(storedSchema || envSchema || "public")

    // Obtener el entorno
    const storedEnv = typeof window !== "undefined" ? window.localStorage.getItem("ENVIRONMENT") : null
    setEnvironment(storedEnv || ENVIRONMENT || "prod")
  }, [])

  // Determinar el color según el entorno
  const getEnvironmentColor = () => {
    switch (environment?.toLowerCase()) {
      case "dev":
        return "text-secondary"
      case "test":
        return "text-primary"
      case "prod":
        return "text-success"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium">
            <Database className={`h-4 w-4 ${getEnvironmentColor()}`} />
            <span className="hidden md:inline text-muted-foreground">
              {schema} / {environment?.toUpperCase()}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            Esquema: <span className="font-medium">{schema}</span>
          </p>
          <p>
            Entorno: <span className="font-medium">{environment?.toUpperCase()}</span>
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
