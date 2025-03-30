import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileCode, Construction } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between space-y-2 py-4">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Financiero</h2>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Estamos trabajando en esta sección</CardTitle>
          <CardDescription>El dashboard está actualmente en desarrollo</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <Construction className="h-24 w-24 text-muted-foreground mb-6" />
          <div className="text-center max-w-md">
            <h3 className="text-xl font-medium mb-2">Próximamente</h3>
            <p className="text-muted-foreground mb-6">
              Estamos desarrollando un dashboard completo con resúmenes de tus finanzas, gráficos interactivos y
              métricas personalizadas. Mientras tanto, puedes acceder a las secciones específicas desde el menú de
              navegación.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <FileCode className="h-4 w-4" />
              <span>Versión en desarrollo</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

