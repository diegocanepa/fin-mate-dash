"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { useTelegram } from "@/lib/telegram-context"

export function TelegramLinkScreen() {
  const [status, setStatus] = useState<"idle" | "linking" | "success" | "error">("idle")
  const [error, setError] = useState<string | null>(null)
  const { isLinked, setIsLinked, isLinking, setIsLinking } = useTelegram()
  const router = useRouter()

  // Si ya está vinculado, redirigir al dashboard
  useEffect(() => {
    if (isLinked) {
      router.push("/")
    }
  }, [isLinked, router])

  const handleLinkTelegram = () => {
    setStatus("linking")
    setIsLinking(true)
    setError(null)

    // Simulamos el proceso de vinculación
    setTimeout(() => {
      // En una implementación real, aquí redirigirías a Telegram
      window.open("https://t.me/your_bot_username?start=unique_user_token", "_blank")
      setStatus("success")

      // Simulamos que el usuario completa el proceso después de un tiempo
      setTimeout(() => {
        setIsLinked(true)
        localStorage.setItem("telegramLinked", "true")
        router.push("/")
      }, 3000)
    }, 1500)
  }

  return (
    <div className="container mx-auto px-4 py-8 transition-all duration-300">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Vincular con Telegram</h1>

        <Card className="border-primary/20">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <path d="m22 2-7 20-4-9-9-4Z" />
                <path d="M22 2 11 13" />
              </svg>
            </div>
            <CardTitle className="text-2xl text-center">Paso Obligatorio</CardTitle>
            <CardDescription className="text-center">
              Para continuar usando FinMate, debes vincular tu cuenta con Telegram. Este paso es necesario para recibir
              notificaciones importantes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert
                variant="destructive"
                className="border-red-500 bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {status === "success" && (
              <Alert className="border-green-500 bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-200">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  ¡Enlace iniciado! Por favor, continúa el proceso en la aplicación de Telegram.
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-medium mb-2">¿Por qué es obligatorio?</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Recibe notificaciones de transacciones en tiempo real</li>
                  <li>Consulta tus saldos y movimientos recientes</li>
                  <li>Registra gastos rápidamente desde cualquier lugar</li>
                  <li>Configura alertas personalizadas para tus finanzas</li>
                </ul>
              </div>

              <div className="flex flex-col items-center text-center space-y-4">
                <p className="text-muted-foreground">
                  No podrás acceder a otras funciones de FinMate hasta completar este paso.
                </p>
                <Button
                  onClick={handleLinkTelegram}
                  className="bg-[#0088cc] hover:bg-[#0088cc]/90 text-white"
                  disabled={status === "linking"}
                  size="lg"
                >
                  {status === "linking" ? "Vinculando..." : "Vincular con Telegram"}
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-4">
            <p className="text-sm text-muted-foreground">
              Este paso es obligatorio para usar FinMate. No podrás continuar sin completarlo.
            </p>
          </CardFooter>
        </Card>

        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold">Instrucciones</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Haz clic en el botón "Vincular con Telegram"</li>
            <li>Se abrirá Telegram con nuestro bot oficial</li>
            <li>Envía el comando que aparecerá en la conversación</li>
            <li>¡Listo! Tu cuenta quedará vinculada automáticamente</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
