import type React from "react"
import { Inter } from "next/font/google"
import { MainNav } from "@/components/layout/main-nav"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth-context"
import { VisibilityProvider } from "@/lib/visibility-context"
import { VisibilityToggle } from "@/components/visibility-toggle"
import { ThemeToggle } from "@/components/theme-toggle"
import { ProtectedLayout } from "@/components/protected-layout"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import "./globals.css"
import { EnvironmentError } from "@/components/environment-error"
import { EnvInjector } from "@/components/env-injector"

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
          <AuthProvider>
            <VisibilityProvider>
              <ProtectedLayout>
                {hasSupabaseEnv ? (
                  <div className="flex min-h-screen flex-col">
                    <header className="sticky top-0 z-50 w-full border-b bg-background">
                      <div className="container flex h-16 items-center">
                        <MainNav />
                        <Link href="/" className="ml-2 flex items-center">
                          <Image
                            src="/images/finmate-logo.png"
                            alt="FinMate Logo"
                            width={32}
                            height={32}
                            className="mr-2"
                          />
                          <span className="hidden text-xl font-bold sm:inline-block">FinMate</span>
                        </Link>
                        <div className="ml-auto flex items-center gap-2">
                          <VisibilityToggle />
                          <ThemeToggle />
                        </div>
                      </div>
                    </header>
                    <main className="flex-1 container py-4 px-2 sm:py-6 sm:px-4 md:px-6">{children}</main>
                    <footer className="border-t py-4 sm:py-6">
                      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
                        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                          © 2025 FinMate
                          {process.env.ENVIRONMENT && process.env.ENVIRONMENT.toLowerCase() !== "prod" && (
                            <span className="ml-2 text-xs text-warning">({process.env.ENVIRONMENT.toUpperCase()})</span>
                          )}
                        </p>
                      </div>
                    </footer>
                  </div>
                ) : (
                  <EnvironmentError />
                )}
              </ProtectedLayout>
            </VisibilityProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
