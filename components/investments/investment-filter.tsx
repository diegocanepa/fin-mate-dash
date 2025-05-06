"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FilterIcon } from "lucide-react"

export function InvestmentFilter() {
  const [category, setCategory] = useState<string>("todas")
  const [platform, setPlatform] = useState<string>("todas")

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Categoría" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todas">Todas las categorías</SelectItem>
          <SelectItem value="acciones">Acciones</SelectItem>
          <SelectItem value="cedear">CEDEARs</SelectItem>
          <SelectItem value="bono">Bonos</SelectItem>
          <SelectItem value="criptomonedas">Criptomonedas</SelectItem>
        </SelectContent>
      </Select>

      <Select value={platform} onValueChange={setPlatform}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Plataforma" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todas">Todas las plataformas</SelectItem>
          <SelectItem value="IOL">IOL</SelectItem>
          <SelectItem value="PPI">PPI</SelectItem>
          <SelectItem value="Binance">Binance</SelectItem>
          <SelectItem value="Lemon">Lemon</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline" size="icon" className="h-10 w-10">
        <FilterIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}
