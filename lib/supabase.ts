import { createClient } from "@supabase/supabase-js"

// Función para verificar y registrar el estado de las variables de entorno
function logEnvironmentVariables() {
  if (typeof window !== "undefined") {
    console.log("Verificando variables de entorno en el cliente:")
    console.log("NEXT_PUBLIC_SUPABASE_URL está definido:", !!process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log("NEXT_PUBLIC_SUPABASE_ANON_KEY está definido:", !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

    // Verificar si las variables tienen contenido (sin mostrar el valor completo por seguridad)
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      console.log(
        "NEXT_PUBLIC_SUPABASE_URL comienza con:",
        process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 8) + "...",
      )
    }

    if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.log(
        "NEXT_PUBLIC_SUPABASE_ANON_KEY comienza con:",
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 8) + "...",
      )
    }
  }
}

// Ejecutar la verificación
logEnvironmentVariables()

// Obtener las variables de entorno con valores por defecto para evitar errores
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Forzar el uso del esquema public independientemente de la variable de entorno
const dbSchema = "public"

// Determinar el entorno (test o prod)
export const ENVIRONMENT = process.env.ENVIRONMENT || "prod"

// Función para obtener el nombre de la tabla según el entorno
export function getTableName(baseTableName: string): string {
  return ENVIRONMENT.toLowerCase() === "test" ? `${baseTableName}_test` : baseTableName
}

// Verificar si tenemos las credenciales necesarias
const hasValidCredentials = supabaseUrl && supabaseKey

// Crear el cliente de Supabase solo si tenemos credenciales válidas
export const supabase = hasValidCredentials
  ? createClient(supabaseUrl, supabaseKey, {
      db: { schema: dbSchema },
    })
  : null

// Función auxiliar para verificar la conexión
export function getSupabaseClient() {
  if (!supabase) {
    console.error("Supabase client not initialized. Check your environment variables.")
    throw new Error("Supabase client not initialized. Check your environment variables.")
  }
  return supabase
}

// Función para obtener el cliente de Supabase en el lado del cliente
export function getSupabaseClientForBrowser() {
  if (typeof window === "undefined") {
    throw new Error("This function should only be called on the client side")
  }

  // Verificar si las variables de entorno están disponibles en el cliente
  const clientSideSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const clientSideSupabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!clientSideSupabaseUrl || !clientSideSupabaseKey) {
    console.warn("Supabase environment variables are not available on the client side.")

    // Intentar usar variables de entorno desde window si están disponibles
    // Esto es una solución alternativa para casos donde las variables de entorno no se cargan correctamente
    const windowSupabaseUrl = (window as any).__NEXT_PUBLIC_SUPABASE_URL
    const windowSupabaseKey = (window as any).__NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (windowSupabaseUrl && windowSupabaseKey) {
      console.log("Usando variables de entorno desde window.__NEXT_DATA__")
      return createClient(windowSupabaseUrl, windowSupabaseKey, {
        db: { schema: "public" },
      })
    }

    // En lugar de lanzar un error, devolvemos un cliente mock o null
    // Esto evitará que la aplicación se rompa, pero las funcionalidades de autenticación no funcionarán
    return null
  }

  if (!supabase) {
    console.warn("Supabase client not initialized. Creating a new client with available environment variables.")
    // Intentar crear un cliente con las variables disponibles en el cliente
    return createClient(clientSideSupabaseUrl, clientSideSupabaseKey, {
      db: { schema: "public" },
    })
  }

  return supabase
}
