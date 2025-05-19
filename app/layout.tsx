import { EnvInjector } from "@/components/env-injector"
import { EnvironmentError } from "@/components/environment-error"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { Inter } from "next/font/google"
import type React from "react"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "FinMate - Rastreador Financiero",
  description: "Una aplicación para el seguimiento de finanzas personales",
  manifest: "/manifest.json",
  themeColor: "#6FB3B8",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FinMate",
  },
  formatDetection: {
    telephone: false,
  },
  generator: 'v0.dev'
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Verificar si las variables de entorno están disponibles
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  const hasSupabaseEnv = supabaseUrl && supabaseAnonKey

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />

        {/* Inyectar las variables de entorno como variables globales */}
        {hasSupabaseEnv && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.__NEXT_PUBLIC_SUPABASE_URL = "${supabaseUrl}";
                window.__NEXT_PUBLIC_SUPABASE_ANON_KEY = "${supabaseAnonKey}";
              `,
            }}
          />
        )}
      </head>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
        {/* Inyectar las variables de entorno usando un componente React */}
        {hasSupabaseEnv && <EnvInjector supabaseUrl={supabaseUrl} supabaseAnonKey={supabaseAnonKey} />}

        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          storageKey="finmate-theme"
          disableTransitionOnChange
        >
          {hasSupabaseEnv ? (
            <div className="flex min-h-screen">
              {/* Contenido principal */}
              <main className="flex-1">{children}</main>
            </div>
          ) : (
            <EnvironmentError />
          )}
        </ThemeProvider>
      </body>
    </html>
  )
}
