import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Determinar el esquema a utilizar basado en la variable de entorno
// Si no está definida, usar 'public' por defecto (producción)
export const DB_SCHEMA = process.env.NEXT_PUBLIC_DB_SCHEMA || "public"
console.log("Supabase DB_SCHEMA:", DB_SCHEMA);

export const supabase = createClient(supabaseUrl, supabaseKey)

// Función auxiliar para obtener una referencia a una tabla con el esquema configurado
// Alternativa si la primera solución no funciona
export function getTableWithSchema(tableName: string) {
  var table
  table = supabase.schema(DB_SCHEMA).from(tableName);
  console.log("Supabase table_name:", table);
  return tableName
}