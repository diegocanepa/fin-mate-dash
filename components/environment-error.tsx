"use client"

import { AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function EnvironmentError() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <CardTitle>Error de configuración</CardTitle>
          </div>
          <CardDescription>
            No se pudieron cargar las variables de entorno necesarias para la aplicación.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            La aplicación requiere las siguientes variables de entorno para funcionar correctamente:
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
            <li>NEXT_PUBLIC_SUPABASE_URL</li>
            <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
          </ul>
          <p className="mt-4 text-sm text-muted-foreground">
            Por favor, asegúrate de que estas variables estén correctamente configuradas en tu entorno.
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" onClick={() => window.location.reload()}>
            Reintentar
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
