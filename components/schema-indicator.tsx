"use client"

import { useEffect, useState } from "react"
import { ENVIRONMENT } from "@/lib/supabase"

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

  // Este componente ya no se usa en el layout
  return null
}
