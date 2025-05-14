"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export function TelegramLinkScreen() {
  const [status, setStatus] = useState<"idle" | "linking" | "success" | "error">("idle")
  const [error, setError] = useState<string | null>(null)

  const handleLinkTelegram = () => {
    setStatus("linking")
    setError(null)

    // Simulamos el proceso de vinculación
    setTimeout(() => {
      // En una implementación real, aquí redirigirías a Telegram
      window.open("https://t.me/your_bot_username?start=unique_user_token", "_blank")
      setStatus("success")
    }, 1500)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Vincular con Telegram</h1>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Paso Obligatorio</CardTitle>
            <CardDescription className="text-center">
              Para continuar usando FinMate, debes vincular tu cuenta con Telegram.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {status === "success" && (
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  ¡Enlace iniciado! Por favor, continúa el proceso en la aplicación de Telegram.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col items-center text-center space-y-4">
              <Button
                onClick={handleLinkTelegram}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={status === "linking"}
                size="lg"
              >
                {status === "linking" ? "Vinculando..." : "Vincular con Telegram"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
