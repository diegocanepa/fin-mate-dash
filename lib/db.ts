import { createClient } from "@supabase/supabase-js"

// Inicializar el cliente de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// Tipos para las tablas
export type CambioDivisas = {
  id: number
  fecha: string
  accion: string
  cantidad: number
  moneda_origen: string
  moneda_destino: string
  precio_cambio: number
  total: number
  descripcion: string
}

export type Inversion = {
  id: number
  fecha: string
  accion: string
  categoria: string
  plataforma: string
  cantidad: number
  precio_unidad: number
  moneda: string
  descripcion: string
}

export type Transferencia = {
  id: number
  fecha: string
  accion: string
  categoria: string
  billetera_origen: string
  billetera_destino: string
  monto_inicial: number
  monto_final: number
  moneda: string
  comision: number
  descripcion: string
}

export type GastoIngreso = {
  id: number
  fecha: string
  accion: string
  amount: number
  moneda: string
  categoria: string
  descripcion: string
}

export type Billetera = {
  id: number
  nombre: string
  saldo: number
  moneda: string
  ultima_actualizacion: string
}

// Funciones para obtener datos
export async function getCambiosDivisas() {
  const { data, error } = await supabase.from("cambio_divisas").select("*").order("fecha", { ascending: false })

  if (error) throw error
  return data as CambioDivisas[]
}

export async function getInversiones() {
  const { data, error } = await supabase.from("inversiones").select("*").order("fecha", { ascending: false })

  if (error) throw error
  return data as Inversion[]
}

export async function getTransferencias() {
  const { data, error } = await supabase.from("transferencias").select("*").order("fecha", { ascending: false })

  if (error) throw error
  return data as Transferencia[]
}

export async function getGastosIngresos() {
  const { data, error } = await supabase.from("gastos_ingresos").select("*").order("fecha", { ascending: false })

  if (error) throw error
  return data as GastoIngreso[]
}

export async function getBilleteras() {
  const { data, error } = await supabase.from("billeteras").select("*")

  if (error) throw error
  return data as Billetera[]
}

// Funciones para filtrar por fecha
export async function getCambiosDivisasByMonth(year: number, month: number) {
  const startDate = new Date(year, month - 1, 1).toISOString().split("T")[0]
  const endDate = new Date(year, month, 0).toISOString().split("T")[0]

  const { data, error } = await supabase
    .from("cambio_divisas")
    .select("*")
    .gte("fecha", startDate)
    .lte("fecha", endDate)
    .order("fecha", { ascending: false })

  if (error) throw error
  return data as CambioDivisas[]
}

export async function getInversionesByMonth(year: number, month: number) {
  const startDate = new Date(year, month - 1, 1).toISOString().split("T")[0]
  const endDate = new Date(year, month, 0).toISOString().split("T")[0]

  const { data, error } = await supabase
    .from("inversiones")
    .select("*")
    .gte("fecha", startDate)
    .lte("fecha", endDate)
    .order("fecha", { ascending: false })

  if (error) throw error
  return data as Inversion[]
}

export async function getGastosIngresosByMonth(year: number, month: number) {
  const startDate = new Date(year, month - 1, 1).toISOString().split("T")[0]
  const endDate = new Date(year, month, 0).toISOString().split("T")[0]

  const { data, error } = await supabase
    .from("gastos_ingresos")
    .select("*")
    .gte("fecha", startDate)
    .lte("fecha", endDate)
    .order("fecha", { ascending: false })

  if (error) throw error
  return data as GastoIngreso[]
}

// Funciones para agregar datos
export async function addCambioDivisas(cambio: Omit<CambioDivisas, "id">) {
  const { data, error } = await supabase.from("cambio_divisas").insert([cambio]).select()

  if (error) throw error
  return data[0] as CambioDivisas
}

export async function addInversion(inversion: Omit<Inversion, "id">) {
  const { data, error } = await supabase.from("inversiones").insert([inversion]).select()

  if (error) throw error
  return data[0] as Inversion
}

export async function addTransferencia(transferencia: Omit<Transferencia, "id">) {
  const { data, error } = await supabase.from("transferencias").insert([transferencia]).select()

  if (error) throw error
  return data[0] as Transferencia
}

export async function addGastoIngreso(gastoIngreso: Omit<GastoIngreso, "id">) {
  const { data, error } = await supabase.from("gastos_ingresos").insert([gastoIngreso]).select()

  if (error) throw error
  return data[0] as GastoIngreso
}

// Funciones para actualizar billeteras
export async function updateBilletera(id: number, saldo: number) {
  const { data, error } = await supabase
    .from("billeteras")
    .update({ saldo, ultima_actualizacion: new Date().toISOString() })
    .eq("id", id)
    .select()

  if (error) throw error
  return data[0] as Billetera
}

