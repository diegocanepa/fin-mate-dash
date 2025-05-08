"use client"

import Link from "next/link"
import Image from "next/image"
import { MainNav } from "./main-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { VisibilityToggle } from "@/components/visibility-toggle"

export function MobileHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background lg:hidden">
      <div className="flex h-14 items-center px-4">
        <MainNav />
        <Link href="/" className="ml-2 flex items-center">
          <Image src="/images/finmate-logo.png" alt="FinMate Logo" width={32} height={32} className="mr-2" />
          <span className="text-lg font-bold">FinMate</span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <VisibilityToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
