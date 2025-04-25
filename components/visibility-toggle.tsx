"use client"

import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useVisibility } from "@/lib/visibility-context"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function VisibilityToggle() {
  const { isVisible, toggleVisibility } = useVisibility()

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleVisibility}
            className="h-9 w-9"
            aria-label={isVisible ? "Ocultar datos sensibles" : "Mostrar datos sensibles"}
          >
            {isVisible ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isVisible ? "Ocultar datos sensibles" : "Mostrar datos sensibles"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
