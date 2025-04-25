import { getSupabaseClient, getTableName, ENVIRONMENT } from "./supabase"

// Nombres de tablas base
const FOREX_TABLE = "forex"
const INVESTMENTS_TABLE = "investments"
const TRANSACTIONS_TABLE = "transactions"
const TRANSFERS_TABLE = "transfers"

// Usar getTableName para determinar el nombre de la tabla según el entorno
const forexTable = getTableName(FOREX_TABLE)
const investmentsTable = getTableName(INVESTMENTS_TABLE)
const transactionsTable = getTableName(TRANSACTIONS_TABLE)
const transfersTable = getTableName(TRANSFERS_TABLE)

// Tipos para las tablas según la estructura real
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

export type Investment = {
  id: number
  fecha: string
  accion: string
  categoria: string
  plataforma: string
  cantidad: number
  precio_unidad: number
  moneda: string
  descripcion: string
  amout: number
  price: number
  currency: string
  date: string
  description: string
  platform: string
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

// Modificar el tipo Wallet para que refleje la estructura que vamos a devolver
export type Wallet = {
  name: string
  balance: number
  currency: string
  last_update: string
}

// Modificar el tipo Billetera para que coincida con Wallet
export type Billetera = Wallet

// Modificar la función testDatabaseConnection para usar la sintaxis correcta de Supabase
export async function testDatabaseConnection() {
  try {
    console.log(`Intentando conectar en entorno: ${ENVIRONMENT}`)
    console.log(`Tabla de transacciones: ${transactionsTable}`)

    const client = getSupabaseClient()

    // Usar .count() en lugar de select("count(*)")
    const { count, error } = await client.from(transactionsTable).select("*", { count: "exact", head: true })

    if (error) {
      console.error(`Error al conectar a la tabla ${transactionsTable}:`, error)
      return { success: false, error }
    }

    console.log(`Conexión exitosa a la tabla ${transactionsTable}. Conteo de registros:`, count)
    return { success: true, data: { count } }
  } catch (error) {
    console.error(`Error inesperado al conectar a la base de datos:`, error)
    return { success: false, error }
  }
}

// Funciones para obtener datos
export async function getCambiosDivisas(): Promise<CambioDivisas[]> {
  try {
    const client = getSupabaseClient()
    const { data, error } = await client.from(forexTable).select("*").order("date", { ascending: false })

    if (error) throw error
    return data as CambioDivisas[]
  } catch (error) {
    console.error(`Error fetching cambios divisas data:`, error)
    return []
  }
}

export async function getInvestments(): Promise<Investment[]> {
  try {
    const client = getSupabaseClient()
    const { data, error } = await client.from(investmentsTable).select("*").order("date", { ascending: false })

    if (error) throw error
    return data as Investment[]
  } catch (error) {
    console.error(`Error fetching inversiones data:`, error)
    return []
  }
}

export async function getGastosIngresos(): Promise<GastoIngreso[]> {
  try {
    const client = getSupabaseClient()
    const { data, error } = await client.from(transactionsTable).select("*").order("date", { ascending: false })

    if (error) throw error
    return data as GastoIngreso[]
  } catch (error) {
    console.error(`Error fetching gastos ingresos data:`, error)
    return []
  }
}

export async function getBilleteras(): Promise<Billetera[]> {
  try {
    const client = getSupabaseClient()
    // Obtener todas las transferencias
    const { data: transfers, error } = await client.from(transfersTable).select("*").order("date", { ascending: true })

    if (error) throw error

    if (!transfers || transfers.length === 0) {
      // Si no hay transferencias, devolver un array vacío
      return []
    }

    // Crear un diccionario para almacenar los saldos de las billeteras
    const walletBalances: Record<string, { balance: number; currency: string; last_update: string }> = {}

    // Procesar todas las transferencias para calcular los saldos
    transfers.forEach((transfer) => {
      const { wallet_from, wallet_to, initial_amount, final_amount, currency, date } = transfer

      // Caso 1: wallet_from existe, descontar de la billetera origen
      if (wallet_from) {
        // Inicializar la billetera de origen si no existe
        if (!walletBalances[wallet_from]) {
          walletBalances[wallet_from] = {
            balance: 0,
            currency,
            last_update: date,
          }
        }

        // Descontar de la billetera origen
        walletBalances[wallet_from].balance -= initial_amount

        // Actualizar fecha de última actualización si es más reciente
        const transferDate = new Date(date)
        const fromWalletDate = new Date(walletBalances[wallet_from].last_update)
        if (transferDate > fromWalletDate) {
          walletBalances[wallet_from].last_update = date
        }
      }

      // Caso 2: wallet_to existe, sumar a la billetera destino
      if (wallet_to) {
        // Inicializar la billetera de destino si no existe
        if (!walletBalances[wallet_to]) {
          walletBalances[wallet_to] = {
            balance: 0,
            currency,
            last_update: date,
          }
        }

        // Sumar a la billetera destino
        walletBalances[wallet_to].balance += final_amount

        // Actualizar fecha de última actualización si es más reciente
        const transferDate = new Date(date)
        const toWalletDate = new Date(walletBalances[wallet_to].last_update)
        if (transferDate > toWalletDate) {
          walletBalances[wallet_to].last_update = date
        }
      }
    })

    // Convertir el diccionario en un array de objetos Wallet
    const wallets: Billetera[] = Object.entries(walletBalances).map(([name, data]) => ({
      name,
      balance: data.balance,
      currency: data.currency,
      last_update: data.last_update,
    }))

    return wallets
  } catch (error) {
    console.error(`Error calculating wallet balances:`, error)
    return []
  }
}

// Funciones para filtrar por fecha
export async function getCambiosDivisasByMonth(year: number, month: number): Promise<CambioDivisas[]> {
  try {
    const client = getSupabaseClient()
    const startDate = new Date(year, month - 1, 1).toISOString()
    const endDate = new Date(year, month, 0).toISOString()

    const { data, error } = await client
      .from(forexTable)
      .select("*")
      .gte("date", startDate)
      .lt("date", endDate)
      .order("date", { ascending: false })

    if (error) throw error
    return data as CambioDivisas[]
  } catch (error) {
    console.error(`Error fetching cambios divisas data by month:`, error)
    return []
  }
}

export async function getInvestmentsByMonth(year: number, month: number): Promise<Investment[]> {
  try {
    const client = getSupabaseClient()
    const startDate = new Date(year, month - 1, 1).toISOString()
    const endDate = new Date(year, month, 0).toISOString()

    const { data, error } = await client
      .from(investmentsTable)
      .select("*")
      .gte("date", startDate)
      .lt("date", endDate)
      .order("date", { ascending: false })

    if (error) throw error
    return data as Investment[]
  } catch (error) {
    console.error(`Error fetching inversiones data by month:`, error)
    return []
  }
}

export async function getGastosIngresosByMonth(year: number, month: number): Promise<GastoIngreso[]> {
  try {
    const client = getSupabaseClient()
    const startDate = new Date(year, month - 1, 1).toISOString()
    const endDate = new Date(year, month, 0).toISOString()

    const { data, error } = await client
      .from(transactionsTable)
      .select("*")
      .gte("date", startDate)
      .lt("date", endDate)
      .order("date", { ascending: false })

    if (error) throw error
    return data as GastoIngreso[]
  } catch (error) {
    console.error(`Error fetching gastos ingresos data by month:`, error)
    return []
  }
}

// Funciones para agregar datos
export async function addGastoIngreso(gastoIngreso: Omit<GastoIngreso, "id">) {
  try {
    const client = getSupabaseClient()
    const { data, error } = await client.from(transactionsTable).insert([gastoIngreso]).select()

    if (error) throw error
    return data[0] as GastoIngreso
  } catch (error) {
    console.error(`Error adding gasto ingreso:`, error)
    throw error
  }
}

export async function getTransactions(): Promise<Transaction[]> {
  try {
    const client = getSupabaseClient()
    const { data, error } = await client.from(transactionsTable).select("*").order("date", { ascending: false })

    if (error) throw error
    return data as Transaction[]
  } catch (error) {
    console.error(`Error fetching transactions data:`, error)
    return []
  }
}

// Asegurarnos de que todas las consultas usen el esquema correcto
// Agregar un mensaje de depuración al inicio de getTransactionsByMonth

export async function getTransactionsByMonth(year: number, month: number): Promise<Transaction[]> {
  try {
    console.log(`Consultando transacciones para ${year}-${month} en la tabla ${transactionsTable}`)
    const client = getSupabaseClient()

    // Crear fechas para el rango del mes
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0)

    // Formatear fechas como strings ISO
    const startDateStr = startDate.toISOString()
    const endDateStr = endDate.toISOString()

    console.log(`Rango de fechas: ${startDateStr} a ${endDateStr}`)

    // Realizar la consulta con el esquema explícito
    const { data, error } = await client
      .from(transactionsTable)
      .select("*")
      .gte("date", startDateStr)
      .lt("date", endDateStr)
      .order("date", { ascending: false })

    if (error) {
      console.error("Error en consulta de transacciones:", error)
      throw error
    }

    console.log(`Transacciones encontradas: ${data?.length || 0}`)
    return (data as Transaction[]) || []
  } catch (error) {
    console.error(`Error fetching transactions data by month:`, error)
    // Devolver un array vacío en caso de error para evitar que la aplicación se rompa
    return []
  }
}

export type Transaction = {
  id: string
  description: string
  amount: number
  currency: string
  category: string
  date: string
  action: string
}

export type Transfer = {
  id: string
  description: string
  category: string
  date: string
  action: string
  wallet_from: string
  wallet_to: string
  initial_amount: number
  final_amount: number
  currency: string
}

export async function getTransfers(): Promise<Transfer[]> {
  try {
    const client = getSupabaseClient()
    const { data, error } = await client.from(transfersTable).select("*").order("date", { ascending: false })

    if (error) throw error
    return data as Transfer[]
  } catch (error) {
    console.error(`Error fetching transfers data:`, error)
    return []
  }
}

export async function getTransfersByMonth(year: number, month: number): Promise<Transfer[]> {
  try {
    const client = getSupabaseClient()
    const startDate = new Date(year, month - 1, 1).toISOString()
    const endDate = new Date(year, month, 0).toISOString()

    const { data, error } = await client
      .from(transfersTable)
      .select("*")
      .gte("date", startDate)
      .lt("date", endDate)
      .order("date", { ascending: false })

    if (error) throw error
    return data as Transfer[]
  } catch (error) {
    console.error(`Error fetching transfers data by month:`, error)
    return []
  }
}

export type Forex = {
  id: string
  date: string
  action: string
  amount: number
  currency_from: string
  currency_to: string
  exchange_rate: number
  total: number
  description: string
}

export async function getForex(): Promise<Forex[]> {
  try {
    const client = getSupabaseClient()
    const { data, error } = await client.from(forexTable).select("*").order("date", { ascending: false })

    if (error) throw error
    return data as Forex[]
  } catch (error) {
    console.error(`Error fetching forex data:`, error)
    return []
  }
}

export async function getForexByMonth(year: number, month: number): Promise<Forex[]> {
  try {
    const client = getSupabaseClient()
    const startDate = new Date(year, month - 1, 1).toISOString()
    const endDate = new Date(year, month, 0).toISOString()

    const { data, error } = await client
      .from(forexTable)
      .select("*")
      .gte("date", startDate)
      .lt("date", endDate)
      .order("date", { ascending: false })

    if (error) throw error
    return data as Forex[]
  } catch (error) {
    console.error(`Error fetching forex data by month:`, error)
    return []
  }
}

export type Inversion = Investment
export { getInvestments as getInversiones, getInvestmentsByMonth as getInversionesByMonth }
