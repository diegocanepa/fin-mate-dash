"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { registerWithPassword, signInWithProvider } from "@/lib/auth-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Eye, EyeOff } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { SocialButton } from "./auth/social-button"

export function RegisterScreen() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
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
    setSuccess(null)

    // Validación básica
    if (!email.trim()) {
      setError("Por favor ingresa tu email")
      setIsLoading(false)
      setShake(true)
      return
    }

    if (!password.trim()) {
      setError("Por favor ingresa una contraseña")
      setIsLoading(false)
      setShake(true)
      return
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      setIsLoading(false)
      setShake(true)
      return
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      setIsLoading(false)
      setShake(true)
      return
    }

    try {
      const result = await registerWithPassword(email, password)

      if (!result.success) {
        setError(result.message || "Error al registrar la cuenta. Inténtalo de nuevo.")
        setShake(true)
        setIsLoading(false)
        return
      }

      setSuccess(
        "¡Registro exitoso! Revisa tu email para confirmar tu cuenta. Una vez confirmada, podrás iniciar sesión.",
      )

      // Si el registro es exitoso pero requiere verificación de email, no redirigimos
      if (result.session) {
        router.push("/")
        router.refresh()
      }
    } catch (err) {
      setError("Error al registrar la cuenta. Inténtalo de nuevo.")
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
            <CardTitle className="text-2xl text-center">Crear cuenta</CardTitle>
            <CardDescription className="text-center">Regístrate para comenzar a gestionar tus finanzas</CardDescription>
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

            {success && (
              <Alert className="border-green-500 bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-200">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            {/* Botones de inicio de sesión social */}
            <div className="space-y-3">
              <SocialButton
                provider="google"
                label="Registrarme con Google"
                onClick={() => handleSocialLogin("google")}
              />
              <SocialButton
                provider="facebook"
                label="Registrarme con Facebook"
                onClick={() => handleSocialLogin("facebook")}
              />
            </div>

            {/* Separador */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">O regístrate con</span>
              </div>
            </div>

            {/* Formulario de registro tradicional */}
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
                <Label htmlFor="password">Contraseña</Label>
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
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className={cn(
                    "border-primary/20 focus-visible:ring-primary",
                    error &&
                      (password !== confirmPassword || !confirmPassword.trim()) &&
                      "border-red-500 focus-visible:ring-red-500",
                  )}
                />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                {isLoading ? "Creando cuenta..." : "Crear cuenta"}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <p className="text-center text-sm text-muted-foreground w-full">
              ¿Ya tienes una cuenta?{" "}
              <a href="/" className="text-primary hover:underline">
                Inicia sesión aquí
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
