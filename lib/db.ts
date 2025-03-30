import { getTableWithSchema, DB_SCHEMA } from "./supabase"

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

// Funciones para obtener datos
export async function getCambiosDivisas(): Promise<CambioDivisas[]> {
  try {
    const { data, error } = await getTableWithSchema("forex").select("*").order("date", { ascending: false })

    if (error) throw error
    return data as CambioDivisas[]
  } catch (error) {
    console.error(`Error fetching cambios divisas data from schema ${DB_SCHEMA}:`, error)
    return []
  }
}

export async function getInvestments(): Promise<Investment[]> {
  try {
    const { data, error } = await getTableWithSchema("investments").select("*").order("date", { ascending: false })

    if (error) throw error
    return data as Investment[]
  } catch (error) {
    console.error(`Error fetching inversiones data from schema ${DB_SCHEMA}:`, error)
    return []
  }
}

export async function getGastosIngresos(): Promise<GastoIngreso[]> {
  try {
    const { data, error } = await getTableWithSchema("transactions").select("*").order("date", { ascending: false })

    if (error) throw error
    return data as GastoIngreso[]
  } catch (error) {
    console.error(`Error fetching gastos ingresos data from schema ${DB_SCHEMA}:`, error)
    return []
  }
}

// Reemplazar la función getWallets() con esta implementación
export async function getBilleteras(): Promise<Billetera[]> {
  try {
    // Obtener todas las transferencias
    const { data: transfers, error } = await getTableWithSchema("transfers")
      .select("*")
      .order("date", { ascending: true })

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

      // Inicializar la billetera de origen si no existe
      if (!walletBalances[wallet_from]) {
        walletBalances[wallet_from] = {
          balance: 0,
          currency,
          last_update: date,
        }
      }

      // Inicializar la billetera de destino si no existe
      if (!walletBalances[wallet_to]) {
        walletBalances[wallet_to] = {
          balance: 0,
          currency,
          last_update: date,
        }
      }

      // Actualizar saldos
      walletBalances[wallet_from].balance -= initial_amount
      walletBalances[wallet_to].balance += final_amount

      // Actualizar fecha de última actualización si es más reciente
      const transferDate = new Date(date)

      const fromWalletDate = new Date(walletBalances[wallet_from].last_update)
      if (transferDate > fromWalletDate) {
        walletBalances[wallet_from].last_update = date
      }

      const toWalletDate = new Date(walletBalances[wallet_to].last_update)
      if (transferDate > toWalletDate) {
        walletBalances[wallet_to].last_update = date
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
    console.error(`Error calculating wallet balances from schema ${DB_SCHEMA}:`, error)
    return []
  }
}

// Funciones para filtrar por fecha
export async function getCambiosDivisasByMonth(year: number, month: number): Promise<CambioDivisas[]> {
  try {
    const startDate = new Date(year, month - 1, 1).toISOString()
    const endDate = new Date(year, month, 0).toISOString()

    const { data, error } = await getTableWithSchema("forex")
      .select("*")
      .gte("date", startDate)
      .lt("date", endDate)
      .order("date", { ascending: false })

    if (error) throw error
    return data as CambioDivisas[]
  } catch (error) {
    console.error(`Error fetching cambios divisas data by month from schema ${DB_SCHEMA}:`, error)
    return []
  }
}

export async function getInvestmentsByMonth(year: number, month: number): Promise<Investment[]> {
  try {
    const startDate = new Date(year, month - 1, 1).toISOString()
    const endDate = new Date(year, month, 0).toISOString()

    const { data, error } = await getTableWithSchema("investments")
      .select("*")
      .gte("date", startDate)
      .lt("date", endDate)
      .order("date", { ascending: false })

    if (error) throw error
    return data as Investment[]
  } catch (error) {
    console.error(`Error fetching inversiones data by month from schema ${DB_SCHEMA}:`, error)
    return []
  }
}

export async function getGastosIngresosByMonth(year: number, month: number): Promise<GastoIngreso[]> {
  try {
    const startDate = new Date(year, month - 1, 1).toISOString()
    const endDate = new Date(year, month, 0).toISOString()

    const { data, error } = await getTableWithSchema("transactions")
      .select("*")
      .gte("date", startDate)
      .lt("date", endDate)
      .order("date", { ascending: false })

    if (error) throw error
    return data as GastoIngreso[]
  } catch (error) {
    console.error(`Error fetching gastos ingresos data by month from schema ${DB_SCHEMA}:`, error)
    return []
  }
}

// Funciones para agregar datos
export async function addGastoIngreso(gastoIngreso: Omit<GastoIngreso, "id">) {
  try {
    const { data, error } = await getTableWithSchema("transactions").insert([gastoIngreso]).select()

    if (error) throw error
    return data[0] as GastoIngreso
  } catch (error) {
    console.error(`Error adding gasto ingreso to schema ${DB_SCHEMA}:`, error)
    throw error
  }
}

export async function getTransactions(): Promise<Transaction[]> {
  try {
    const { data, error } = await getTableWithSchema("transactions").select("*").order("date", { ascending: false })

    if (error) throw error
    return data as Transaction[]
  } catch (error) {
    console.error(`Error fetching transactions data from schema ${DB_SCHEMA}:`, error)
    return []
  }
}

export async function getTransactionsByMonth(year: number, month: number): Promise<Transaction[]> {
  try {
    const startDate = new Date(year, month - 1, 1).toISOString()
    const endDate = new Date(year, month, 0).toISOString()

    const { data, error } = await getTableWithSchema("transactions")
      .select("*")
      .gte("date", startDate)
      .lt("date", endDate)
      .order("date", { ascending: false })

    if (error) throw error
    return data as Transaction[]
  } catch (error) {
    console.error(`Error fetching transactions data by month from schema ${DB_SCHEMA}:`, error)
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
    const { data, error } = await getTableWithSchema("transfers").select("*").order("date", { ascending: false })

    if (error) throw error
    return data as Transfer[]
  } catch (error) {
    console.error(`Error fetching transfers data from schema ${DB_SCHEMA}:`, error)
    return []
  }
}

export async function getTransfersByMonth(year: number, month: number): Promise<Transfer[]> {
  try {
    const startDate = new Date(year, month - 1, 1).toISOString()
    const endDate = new Date(year, month, 0).toISOString()

    const { data, error } = await getTableWithSchema("transfers")
      .select("*")
      .gte("date", startDate)
      .lt("date", endDate)
      .order("date", { ascending: false })

    if (error) throw error
    return data as Transfer[]
  } catch (error) {
    console.error(`Error fetching transfers data by month from schema ${DB_SCHEMA}:`, error)
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
    const { data, error } = await getTableWithSchema("forex").select("*").order("date", { ascending: false })

    if (error) throw error
    return data as Forex[]
  } catch (error) {
    console.error(`Error fetching forex data from schema ${DB_SCHEMA}:`, error)
    return []
  }
}

export async function getForexByMonth(year: number, month: number): Promise<Forex[]> {
  try {
    const startDate = new Date(year, month - 1, 1).toISOString()
    const endDate = new Date(year, month, 0).toISOString()

    const { data, error } = await getTableWithSchema("forex")
      .select("*")
      .gte("date", startDate)
      .lt("date", endDate)
      .order("date", { ascending: false })

    if (error) throw error
    return data as Forex[]
  } catch (error) {
    console.error(`Error fetching forex data by month from schema ${DB_SCHEMA}:`, error)
    return []
  }
}

export type Inversion = Investment
export { getInvestments as getInversiones, getInvestmentsByMonth as getInversionesByMonth }

