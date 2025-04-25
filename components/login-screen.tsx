"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { LockIcon, AlertCircle, MailIcon } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function LoginScreen() {
  const { login, isLoading } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [attempts, setAttempts] = useState(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      setError("Por favor ingresa un email")
      return
    }

    if (!password.trim()) {
      setError("Por favor ingresa una contraseña")
      return
    }

    setError(null)

    const result = await login(email, password)
    if (!result.success) {
      setAttempts((prev) => prev + 1)
      setError(result.message || "Credenciales incorrectas. Inténtalo de nuevo.")
      setPassword("")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <LockIcon className="h-10 w-10 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Rastreador Financiero</CardTitle>
          <CardDescription>Ingresa tus credenciales para acceder a tus datos financieros</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <div className="relative">
                <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={error && !email.trim() ? "border-red-500 pl-10" : "pl-10"}
                  autoFocus
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative">
                <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={error && !password.trim() ? "border-red-500 pl-10" : "pl-10"}
                  disabled={isLoading}
                />
              </div>
              {attempts >= 3 && (
                <p className="text-sm text-amber-600">
                  Alerta: Demasiados intentos fallidos pueden bloquear temporalmente tu acceso.
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Verificando..." : "Acceder"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
