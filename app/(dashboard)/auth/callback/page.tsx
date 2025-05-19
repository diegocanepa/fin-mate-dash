import { Loader2 } from "lucide-react"

export default function AuthCallbackPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <h1 className="text-xl font-semibold">Procesando autenticación...</h1>
        <p className="text-muted-foreground">Serás redirigido en un momento.</p>
      </div>
    </div>
  )
}
