import type React from "react"
import { Inter } from "next/font/google"
import { MainNav } from "@/components/layout/main-nav"
import { ThemeProvider } from "@/components/theme-provider"
import { SchemaIndicator } from "@/components/schema-indicator"
import { AuthProvider } from "@/lib/auth-context"
import { VisibilityProvider } from "@/lib/visibility-context"
import { VisibilityToggle } from "@/components/visibility-toggle"
import { ProtectedLayout } from "@/components/protected-layout"
import { cn } from "@/lib/utils"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Rastreador Financiero",
  description: "Una aplicación para el seguimiento de finanzas personales",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <AuthProvider>
            <VisibilityProvider>
              <ProtectedLayout>
                <div className="flex min-h-screen flex-col">
                  <header className="sticky top-0 z-50 w-full border-b bg-background">
                    <div className="container flex h-16 items-center">
                      <MainNav />
                      <div className="ml-auto flex items-center gap-2">
                        <VisibilityToggle />
                        <SchemaIndicator />
                      </div>
                    </div>
                  </header>
                  <main className="flex-1 container py-6 px-2 sm:px-4 md:px-6">{children}</main>
                  <footer className="border-t py-6">
                    <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
                      <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                        © 2023 Rastreador Financiero. Todos los derechos reservados.
                      </p>
                    </div>
                  </footer>
                </div>
              </ProtectedLayout>
            </VisibilityProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
