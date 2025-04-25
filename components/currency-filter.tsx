"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface CurrencyFilterProps {
  currencies?: { value: string; label: string }[]
  onCurrencyChange?: (currency: string | null) => void
  defaultCurrency?: string | null
}

export function CurrencyFilter({
  currencies = [
    { value: "USD", label: "Dólares (USD)" },
    { value: "ARS", label: "Pesos (ARS)" },
    { value: "EUR", label: "Euros (EUR)" },
  ],
  onCurrencyChange,
  defaultCurrency = null,
}: CurrencyFilterProps) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<string | null>(defaultCurrency)

  const handleSelect = (currentValue: string) => {
    const newValue = currentValue === value ? null : currentValue
    setValue(newValue)
    setOpen(false)
    if (onCurrencyChange) {
      onCurrencyChange(newValue)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
          {value ? currencies.find((currency) => currency.value === value)?.label : "Todas las monedas"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Buscar moneda..." />
          <CommandList>
            <CommandEmpty>No se encontró la moneda.</CommandEmpty>
            <CommandGroup>
              <CommandItem onSelect={() => handleSelect("")} className="text-sm">
                <Check className={cn("mr-2 h-4 w-4", !value ? "opacity-100" : "opacity-0")} />
                Todas las monedas
              </CommandItem>
              {currencies.map((currency) => (
                <CommandItem key={currency.value} value={currency.value} onSelect={() => handleSelect(currency.value)}>
                  <Check className={cn("mr-2 h-4 w-4", value === currency.value ? "opacity-100" : "opacity-0")} />
                  {currency.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
