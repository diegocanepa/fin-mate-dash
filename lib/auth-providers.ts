import type { Provider } from "@supabase/supabase-js"

// Tipos para las configuraciones de proveedores
export type ProviderConfig = {
  id: Provider
  name: string
  icon: string
  color: string
  hoverColor: string
  textColor: string
}

// Configuración de los proveedores de autenticación
export const AUTH_PROVIDERS: Record<Provider, ProviderConfig> = {
  google: {
    id: "google",
    name: "Google",
    icon: "google",
    color: "bg-white dark:bg-slate-800",
    hoverColor: "hover:bg-gray-100 dark:hover:bg-slate-700",
    textColor: "text-slate-900 dark:text-white",
  },
  facebook: {
    id: "facebook",
    name: "Facebook",
    icon: "facebook",
    color: "bg-[#1877F2]",
    hoverColor: "hover:bg-[#0c63d4]",
    textColor: "text-white",
  },
  // Otros proveedores pueden ser añadidos aquí en el futuro
} as const

export const ENABLED_PROVIDERS: Provider[] = ["google", "facebook"]
