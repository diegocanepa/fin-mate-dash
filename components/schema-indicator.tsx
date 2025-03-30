"use client"

import { DB_SCHEMA } from "@/lib/supabase"
import { Badge } from "@/components/ui/badge"

export function SchemaIndicator() {
  const isTest = DB_SCHEMA !== "public"

  return (
    <Badge variant={isTest ? "destructive" : "secondary"} className="ml-2">
      {isTest ? "TEST" : "PROD"}
    </Badge>
  )
}

