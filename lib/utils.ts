import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Currency } from "./investment-data"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: Currency): string {
  switch (currency) {
    case "ARS":
      return `$${amount.toLocaleString("es-AR", { maximumFractionDigits: 2 })}`
    case "USD":
    case "USDT":
      return `U$D${amount.toLocaleString("es-AR", { maximumFractionDigits: 2 })}`
    case "BTC":
      return `₿${amount.toLocaleString("es-AR", { maximumFractionDigits: 8 })}`
    case "ETH":
      return `Ξ${amount.toLocaleString("es-AR", { maximumFractionDigits: 8 })}`
    default:
      return `${amount.toLocaleString("es-AR", { maximumFractionDigits: 2 })} ${currency}`
  }
}
