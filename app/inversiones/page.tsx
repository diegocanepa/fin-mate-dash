"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InvestmentDashboard } from "@/components/investments/dashboard"
import { ActiveInvestments } from "@/components/investments/active-investments"
import { ClosedInvestments } from "@/components/investments/closed-investments"
import { InvestmentHistory } from "@/components/investments/investment-history"
import { DistributionChart } from "@/components/investments/distribution-chart"
import { PortfolioEvolution } from "@/components/investments/portfolio-evolution"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { QuoteProvider } from "@/lib/quote-context"
import { Button } from "@/components/ui/button"
import { RefreshCwIcon, AlertTriangleIcon } from "lucide-react"
import { useQuotes } from "@/lib/quote-context"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Componente StatusIndicator para mostrar estado de carga o error
function StatusIndicator() {
  const { isLoading, error, lastUpdated, fetchQuotes } = useQuotes()

  return (
    <div className="flex items-center gap-2">
      {error && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center text-red-500">
                <AlertTriangleIcon className="h-4 w-4 mr-1" />
                <span className="text-xs">Error</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{error}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      {lastUpdated && !error && (
        <span className="text-xs text-muted-foreground">Actualizado: {lastUpdated.toLocaleTimeString()}</span>
      )}
      <Button variant="outline" size="sm" onClick={fetchQuotes} disabled={isLoading}>
        <RefreshCwIcon className={`h-4 w-4 mr-1 ${isLoading ? "animate-spin" : ""}`} />
        Actualizar
      </Button>
    </div>
  )
}

// Componente principal
export default function InvestmentsPage() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const isMobile = useMediaQuery("(max-width: 640px)")
  const isTablet = useMediaQuery("(max-width: 768px)")

  return (
    <QuoteProvider>
      <div className="container mx-auto py-6 space-y-6 px-4">
        <div className="flex flex-col space-y-2 md:flex-row md:justify-between md:items-center md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Inversiones</h1>
            <p className="text-muted-foreground">
              Gestiona tus inversiones, analiza su rendimiento y toma decisiones informadas.
            </p>
          </div>
          <StatusIndicator />
        </div>

        {isMobile ? (
          // Versión móvil: Dropdown select para los tabs
          <div className="w-full mb-6">
            <Select value={activeTab} onValueChange={setActiveTab}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar vista" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dashboard">Dashboard</SelectItem>
                <SelectItem value="active">Inversiones Activas</SelectItem>
                <SelectItem value="closed">Inversiones Cerradas</SelectItem>
                <SelectItem value="history">Historial</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ) : (
          // Versión tablet/desktop: Tabs tradicionales con diseño responsivo
          <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className={`w-full flex ${isTablet ? "flex-wrap gap-2" : ""}`}>
              <TabsTrigger value="dashboard" className={`${isTablet ? "flex-1 min-width-0" : ""}`}>
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="active" className={`${isTablet ? "flex-1 min-width-0" : ""}`}>
                Activas
              </TabsTrigger>
              <TabsTrigger value="closed" className={`${isTablet ? "flex-1 min-width-0" : ""}`}>
                Cerradas
              </TabsTrigger>
              <TabsTrigger value="history" className={`${isTablet ? "flex-1 min-width-0" : ""}`}>
                Historial
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}

        {/* Contenido de los tabs - se muestra según el tab activo */}
        <div className="mt-6">
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              <InvestmentDashboard />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DistributionChart />
                <PortfolioEvolution />
              </div>
            </div>
          )}

          {activeTab === "active" && (
            <div className="space-y-8">
              <ActiveInvestments />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DistributionChart />
                <PortfolioEvolution />
              </div>
            </div>
          )}

          {activeTab === "closed" && (
            <div className="space-y-8">
              <ClosedInvestments />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DistributionChart />
                <PortfolioEvolution />
              </div>
            </div>
          )}

          {activeTab === "history" && <InvestmentHistory />}
        </div>
      </div>
    </QuoteProvider>
  )
}
