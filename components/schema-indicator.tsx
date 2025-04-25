"use client"

import { Badge } from "@/components/ui/badge"
import { ENVIRONMENT } from "@/lib/supabase"
import { useEffect, useState } from "react"

export function SchemaIndicator() {
  const [env, setEnv] = useState<string>("")

  useEffect(() => {
    // Detectar el entorno
    setEnv(ENVIRONMENT || "prod")
  }, [])

  // Si estamos en producción, no mostrar nada
  if (env === "prod") return null

  // Para cualquier otro entorno (test, dev), mostrar el badge
  return (
    <Badge variant="secondary" className="ml-2">
      {env.toUpperCase()}
    </Badge>
  )
}
