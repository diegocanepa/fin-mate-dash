import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AddTransactionForm } from "@/components/forms/add-transaction-form"

export default function AgregarPage() {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between space-y-2 py-4">
        <h2 className="text-3xl font-bold tracking-tight">Agregar Transacción</h2>
      </div>
      <Tabs defaultValue="gasto-ingreso" className="space-y-4">
        <TabsList>
          <TabsTrigger value="gasto-ingreso">Gasto/Ingreso</TabsTrigger>
          <TabsTrigger value="inversion">Inversión</TabsTrigger>
          <TabsTrigger value="cambio-divisas">Cambio de Divisas</TabsTrigger>
          <TabsTrigger value="transferencia">Transferencia</TabsTrigger>
        </TabsList>
        <TabsContent value="gasto-ingreso" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Agregar Gasto o Ingreso</CardTitle>
              <CardDescription>
                Registra tus gastos e ingresos para llevar un control de tu flujo de dinero
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AddTransactionForm />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="inversion" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Agregar Inversión</CardTitle>
              <CardDescription>Registra tus compras y ventas de inversiones</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Aquí iría el formulario para agregar inversiones */}
              <p>Formulario de inversiones en desarrollo</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="cambio-divisas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Agregar Cambio de Divisas</CardTitle>
              <CardDescription>Registra tus operaciones de cambio de moneda</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Aquí iría el formulario para agregar cambios de divisas */}
              <p>Formulario de cambio de divisas en desarrollo</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="transferencia" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Agregar Transferencia</CardTitle>
              <CardDescription>Registra transferencias entre tus billeteras</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Aquí iría el formulario para agregar transferencias */}
              <p>Formulario de transferencias en desarrollo</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

