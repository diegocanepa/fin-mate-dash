import { getSupabaseClient } from "./supabase"

export async function testDatabaseConnection() {
  try {
    const client = getSupabaseClient()

    // Intentar obtener la información del esquema
    const { data: schemaInfo, error: schemaError } = await client.rpc("get_schema_info")

    if (schemaError) {
      console.error("Error al obtener información del esquema:", schemaError)
    } else {
      console.log("Información del esquema:", schemaInfo)
    }

    // Probar una consulta simple a la tabla de transacciones
    const { data: transactionsData, error: transactionsError } = await client.from("transactions").select("*").limit(1)

    if (transactionsError) {
      console.error("Error al consultar la tabla transactions:", transactionsError)
      return {
        success: false,
        error: transactionsError,
        message: `Error al consultar la tabla transactions: ${transactionsError.message}`,
      }
    }

    console.log("Conexión exitosa a la tabla transactions. Primer registro:", transactionsData[0])
    return {
      success: true,
      data: {
        sample: transactionsData[0],
        count: transactionsData.length,
      },
    }
  } catch (error) {
    console.error("Error inesperado al conectar a la base de datos:", error)
    return {
      success: false,
      error,
      message: `Error inesperado al conectar a la base de datos: ${error}`,
    }
  }
}

// Función para verificar la estructura de la tabla
export async function checkTableStructure(tableName: string) {
  try {
    const client = getSupabaseClient()

    // Consultar la estructura de la tabla
    const { data, error } = await client.rpc("get_table_info", { table_name: tableName })

    if (error) {
      console.error(`Error al obtener la estructura de la tabla ${tableName}:`, error)
      return { success: false, error }
    }

    console.log(`Estructura de la tabla ${tableName}:`, data)
    return { success: true, data }
  } catch (error) {
    console.error(`Error al verificar la estructura de la tabla ${tableName}:`, error)
    return { success: false, error }
  }
}
