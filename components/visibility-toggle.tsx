"use client"

import { useVisibility } from "@/lib/visibility-context"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"
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
            className="text-muted-foreground hover:text-primary"
          >
            {isVisible ? <Eye className="h-[1.2rem] w-[1.2rem]" /> : <EyeOff className="h-[1.2rem] w-[1.2rem]" />}
            <span className="sr-only">{isVisible ? "Ocultar valores" : "Mostrar valores"}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isVisible ? "Ocultar valores" : "Mostrar valores"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
