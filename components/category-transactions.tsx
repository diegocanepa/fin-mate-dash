"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TransactionsTable } from "@/components/tables/transactions-table"
import { CategoryFilter } from "@/components/category-filter"

interface GastoIngreso {
  id: number
  fecha: string
  accion: string
  amount: number
  moneda: string
  categoria: string
  descripcion: string
}

interface CategoryTransactionsProps {
  data: GastoIngreso[]
}

export function CategoryTransactions({ data }: CategoryTransactionsProps) {
  const [filteredData, setFilteredData] = useState<GastoIngreso[]>(data)
  const [selectedCategory, setSelectedCategory] = useState<string>("Todas")

  // Extraer categorías únicas de los datos
  const categories = Array.from(new Set(data.map((item) => item.categoria)))

  useEffect(() => {
    if (selectedCategory === "Todas") {
      setFilteredData(data)
    } else {
      setFilteredData(data.filter((item) => item.categoria === selectedCategory))
    }
  }, [selectedCategory, data])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Transacciones por Categoría</CardTitle>
          <CardDescription>Datos crudos filtrados por categoría</CardDescription>
        </div>
        <CategoryFilter categories={categories} onCategoryChange={setSelectedCategory} />
      </CardHeader>
      <CardContent>
        <TransactionsTable data={filteredData} />
      </CardContent>
    </Card>
  )
}
