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
import Image from "next/image"
import Link from "next/link"
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <AuthProvider>
            <VisibilityProvider>
              <ProtectedLayout>
                <div className="flex min-h-screen flex-col">
                  <header className="sticky top-0 z-50 w-full border-b bg-background">
                    <div className="container flex h-16 items-center">
                      <Link href="/" className="mr-4 flex items-center">
                        <Image
                          src="/images/finmate-logo.png"
                          alt="FinMate Logo"
                          width={40}
                          height={40}
                          className="mr-2"
                        />
                        <span className="hidden text-xl font-bold sm:inline-block">FinMate</span>
                      </Link>
                      <MainNav />
                      <div className="ml-auto flex items-center gap-2">
                        <VisibilityToggle />
                        <SchemaIndicator />
                      </div>
                    </div>
                  </header>
                  <main className="flex-1 container py-4 px-2 sm:py-6 sm:px-4 md:px-6">{children}</main>
                  <footer className="border-t py-4 sm:py-6">
                    <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
                      <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                        © 2025 FinMate.
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
