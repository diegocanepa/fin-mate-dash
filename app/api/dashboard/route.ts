import { NextResponse } from "next/server"
import {
  getCambiosDivisas,
  getInversiones,
  getGastosIngresos,
  getBilleteras,
  getCambiosDivisasByMonth,
  getInversionesByMonth,
  getGastosIngresosByMonth,
} from "@/lib/db"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const year = searchParams.get("year")
  const month = searchParams.get("month")

  try {
    let cambiosDivisas, inversiones, gastosIngresos

    if (year && month) {
      // Filtrar por mes
      cambiosDivisas = await getCambiosDivisasByMonth(Number.parseInt(year), Number.parseInt(month))
      inversiones = await getInversionesByMonth(Number.parseInt(year), Number.parseInt(month))
      gastosIngresos = await getGastosIngresosByMonth(Number.parseInt(year), Number.parseInt(month))
    } else {
      // Obtener todos los datos
      cambiosDivisas = await getCambiosDivisas()
      inversiones = await getInversiones()
      gastosIngresos = await getGastosIngresos()
    }

    const billeteras = await getBilleteras()

    // Calcular métricas
    const totalInversiones = inversiones.reduce((sum, inv) => {
      if (inv.accion === "Compra") {
        return sum + inv.cantidad * inv.precio_unidad
      }
      return sum
    }, 0)

    const totalGastos = gastosIngresos.filter((gi) => gi.accion === "Gasto").reduce((sum, gi) => sum + gi.amount, 0)

    const totalIngresos = gastosIngresos.filter((gi) => gi.accion === "Ingreso").reduce((sum, gi) => sum + gi.amount, 0)

    const totalBalance = totalIngresos - totalGastos

    // Calcular tipo de cambio promedio
    const tipoCambioPromedio =
      cambiosDivisas.length > 0
        ? cambiosDivisas.reduce((sum, cd) => sum + cd.precio_cambio, 0) / cambiosDivisas.length
        : 0

    // Agrupar gastos por categoría
    const gastosPorCategoria = gastosIngresos
      .filter((gi) => gi.accion === "Gasto")
      .reduce(
        (acc, gi) => {
          const categoria = gi.categoria
          if (!acc[categoria]) {
            acc[categoria] = 0
          }
          acc[categoria] += gi.amount
          return acc
        },
        {} as Record<string, number>,
      )

    // Agrupar inversiones por categoría
    const inversionesPorCategoria = inversiones
      .filter((inv) => inv.accion === "Compra")
      .reduce(
        (acc, inv) => {
          const categoria = inv.categoria
          if (!acc[categoria]) {
            acc[categoria] = 0
          }
          acc[categoria] += inv.cantidad * inv.precio_unidad
          return acc
        },
        {} as Record<string, number>,
      )

    return NextResponse.json({
      metrics: {
        totalInversiones,
        totalGastos,
        totalIngresos,
        totalBalance,
        tipoCambioPromedio,
      },
      gastosPorCategoria,
      inversionesPorCategoria,
      billeteras,
    })
  } catch (error) {
    console.error("Error al obtener datos del dashboard:", error)
    return NextResponse.json({ error: "Error al obtener datos del dashboard" }, { status: 500 })
  }
}
