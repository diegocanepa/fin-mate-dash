"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

// Datos de ejemplo - en producción vendrían de la API
const data = [
  { month: "Ene", ingresos: 2400, gastos: 1398, balance: 1002, inversiones: 800, cambio: 950 },
  { month: "Feb", ingresos: 1398, gastos: 1200, balance: 198, inversiones: 1200, cambio: 980 },
  { month: "Mar", ingresos: 9800, gastos: 2000, balance: 7800, inversiones: 2000, cambio: 1020 },
  { month: "Abr", ingresos: 3908, gastos: 2780, balance: 1128, inversiones: 2500, cambio: 1050 },
  { month: "May", ingresos: 4800, gastos: 1890, balance: 2910, inversiones: 3000, cambio: 1080 },
  { month: "Jun", ingresos: 3800, gastos: 2390, balance: 1410, inversiones: 3200, cambio: 1100 },
  { month: "Jul", ingresos: 4300, gastos: 3490, balance: 810, inversiones: 3500, cambio: 1120 },
]

export function Overview() {
  const [activeChart, setActiveChart] = useState("balance")

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="px-0">
        <Tabs defaultValue="balance" value={activeChart} onValueChange={setActiveChart} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="balance">Balance</TabsTrigger>
            <TabsTrigger value="ingresos-gastos">Ingresos/Gastos</TabsTrigger>
            <TabsTrigger value="inversiones">Inversiones</TabsTrigger>
            <TabsTrigger value="cambio">Tipo de Cambio</TabsTrigger>
            <TabsTrigger value="billeteras">Billeteras</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="px-0">
        <TabsContent value="balance" className="mt-0">
          <ChartContainer
            config={{
              balance: {
                label: "Balance",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="aspect-[4/3] sm:aspect-[16/9]"
          >
            <AreaChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="balance"
                stroke="hsl(var(--chart-1))"
                fill="hsl(var(--chart-1))"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ChartContainer>
        </TabsContent>
        <TabsContent value="ingresos-gastos" className="mt-0">
          <ChartContainer
            config={{
              ingresos: {
                label: "Ingresos",
                color: "hsl(var(--chart-2))",
              },
              gastos: {
                label: "Gastos",
                color: "hsl(var(--chart-3))",
              },
            }}
            className="aspect-[4/3] sm:aspect-[16/9]"
          >
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="ingresos" fill="hsl(var(--chart-2))" />
              <Bar dataKey="gastos" fill="hsl(var(--chart-3))" />
            </BarChart>
          </ChartContainer>
        </TabsContent>
        <TabsContent value="inversiones" className="mt-0">
          <ChartContainer
            config={{
              inversiones: {
                label: "Inversiones",
                color: "hsl(var(--chart-4))",
              },
            }}
            className="aspect-[4/3] sm:aspect-[16/9]"
          >
            <LineChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="inversiones" stroke="hsl(var(--chart-4))" strokeWidth={2} />
            </LineChart>
          </ChartContainer>
        </TabsContent>
        <TabsContent value="cambio" className="mt-0">
          <ChartContainer
            config={{
              cambio: {
                label: "USD/ARS",
                color: "hsl(var(--chart-5))",
              },
            }}
            className="aspect-[4/3] sm:aspect-[16/9]"
          >
            <LineChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="cambio" stroke="hsl(var(--chart-5))" strokeWidth={2} />
            </LineChart>
          </ChartContainer>
        </TabsContent>
        <TabsContent value="billeteras" className="mt-0">
          <ChartContainer
            config={{
              wise: {
                label: "Wise",
                color: "hsl(var(--chart-1))",
              },
              deel: {
                label: "Deel",
                color: "hsl(var(--chart-2))",
              },
              revolut: {
                label: "Revolut",
                color: "hsl(var(--chart-3))",
              },
              nexo: {
                label: "Nexo",
                color: "hsl(var(--chart-4))",
              },
            }}
            className="aspect-[4/3] sm:aspect-[16/9]"
          >
            <BarChart
              data={[
                { name: "Wise", value: 4000 },
                { name: "Deel", value: 3000 },
                { name: "Revolut", value: 2000 },
                { name: "Nexo", value: 2780 },
              ]}
              margin={{
                top: 20,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="value" name="Saldo" fill="hsl(var(--chart-1))" />
            </BarChart>
          </ChartContainer>
        </TabsContent>
      </CardContent>
    </Card>
  )
}

