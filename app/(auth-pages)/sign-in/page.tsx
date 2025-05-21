"use client"

import type React from "react"

import { SocialButton } from "@/components/auth/social-button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { login, signInWithProvider } from "@/lib/auth-service"
import { cn } from "@/lib/utils"
import { AlertCircle, Eye, EyeOff } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function LoginScreen() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [shake, setShake] = useState(false)
  const router = useRouter()

  // Efecto para quitar la animación de shake después de un tiempo
  useEffect(() => {
    if (shake) {
      const timer = setTimeout(() => {
        setShake(false)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [shake])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Validación básica
    if (!email.trim()) {
      setError("Por favor ingresa tu email")
      setIsLoading(false)
      setShake(true)
      return
    }

    if (!password.trim()) {
      setError("Por favor ingresa tu contraseña")
      setIsLoading(false)
      setShake(true)
      return
    }

    try {
      const result = await login(email, password, "")

      if (!result.success) {
        setError(result.message || "Credenciales inválidas. Por favor, verifica tu email y contraseña.")
        setShake(true)
        setIsLoading(false)
        return
      }

      router.push("/")
      router.refresh()
    } catch (err) {
      setError("Credenciales inválidas. Por favor, verifica tu email y contraseña.")
      setShake(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider: "google" | "facebook") => {
    setError(null)
    try {
      await signInWithProvider(provider)
      // No necesitamos hacer nada más aquí porque la redirección ya habrá ocurrido
    } catch (error) {
      setError("Error al iniciar sesión con " + provider)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center justify-center">
          <Image src="/images/finmate-logo.png" alt="FinMate Logo" width={120} height={120} className="mb-4" />
          <h1 className="text-3xl font-bold text-primary">FinMate</h1>
          <p className="mt-2 text-center text-muted-foreground">Tu asistente financiero personal</p>
        </div>

        <Card className={cn("border-primary/20 transition-all", shake && "animate-shake")}>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Iniciar sesión</CardTitle>
            <CardDescription className="text-center">Ingresa tus credenciales para acceder a tu cuenta</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {error && (
              <Alert
                variant="destructive"
                className="border-red-500 bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Botones de inicio de sesión social */}
            <div className="space-y-3">
              <SocialButton
                provider="google"
                label="Continuar con Google"
                onClick={() => handleSocialLogin("google")}
              />
              <SocialButton
                provider="facebook"
                label="Continuar con Facebook"
                onClick={() => handleSocialLogin("facebook")}
              />
            </div>

            {/* Separador */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">O continúa con</span>
              </div>
            </div>

            {/* Formulario de inicio de sesión tradicional */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={cn(
                    "border-primary/20 focus-visible:ring-primary",
                    error && !email.trim() && "border-red-500 focus-visible:ring-red-500",
                  )}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Contraseña</Label>
                  <a href="#" className="text-sm text-primary hover:underline">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={cn(
                      "border-primary/20 focus-visible:ring-primary pr-10",
                      error && !password.trim() && "border-red-500 focus-visible:ring-red-500",
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                    onClick={togglePasswordVisibility}
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
