import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Determinar el esquema a utilizar basado en la variable de entorno
// Si no está definida, usar 'public' por defecto (producción)
export const DB_SCHEMA = process.env.NEXT_PUBLIC_DB_SCHEMA || "public"

export const supabase = createClient(supabaseUrl, supabaseKey)

// Función auxiliar para obtener una referencia a una tabla con el esquema configurado
// Alternativa si la primera solución no funciona
export function getTableWithSchema(tableName: string) {
  // Usar SQL directo para especificar el esquema
  return supabase.from(tableName).rpc("set_schema", { schema_name: DB_SCHEMA })
}

