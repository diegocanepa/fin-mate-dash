import { NextResponse } from "next/server"
import { testDatabaseConnection } from "@/lib/db-diagnostics"

export async function GET() {
  try {
    const result = await testDatabaseConnection()

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Error al conectar a la base de datos",
          details: result.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Conexión exitosa a la base de datos",
      data: result.data,
    })
  } catch (error) {
    console.error("Error en la ruta de prueba de DB:", error)
    return NextResponse.json(
      {
        error: "Error inesperado",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
