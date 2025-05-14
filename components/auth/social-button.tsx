"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { AUTH_PROVIDERS } from "@/lib/auth-providers"
import type { Provider } from "@supabase/supabase-js"
import { ProviderIcon } from "./provider-icons"
import { useState } from "react"
import { Loader2 } from "lucide-react"

interface SocialButtonProps {
  provider: Provider
  label: string
  onClick: () => Promise<void>
  className?: string
}

export function SocialButton({ provider, label, onClick, className }: SocialButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const providerConfig = AUTH_PROVIDERS[provider]

  const handleClick = async () => {
    setIsLoading(true)
    try {
      await onClick()
    } catch (error) {
      // El error ya se maneja en el componente padre
      setIsLoading(false)
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      className={cn(
        "w-full flex items-center justify-center gap-2",
        providerConfig.color,
        providerConfig.hoverColor,
        providerConfig.textColor,
        className,
      )}
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <ProviderIcon provider={provider} className="h-4 w-4" />
      )}
      <span>{label}</span>
    </Button>
  )
}
