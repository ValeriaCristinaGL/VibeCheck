"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const turmas = [
  { value: "next.js", label: "Next.js" },
  { value: "sveltekit", label: "SvelteKit" },
  { value: "nuxt.js", label: "Nuxt.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
]

export function ComboboxDemo() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [inputValue, setInputValue] = React.useState("")

  const handleSelect = (selectedValue: string) => {
    setValue(selectedValue)
    setInputValue("") // limpa input
    setOpen(false)
  }

  const selectedLabel =
    turmas.find((f) => f.value === value)?.label || value

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="border-[#394779] bg-[#4A4A4A] hover:bg-[#394779] hover:text-[#fff] text-[#fff] w-full justify-between"
        >
          {value ? selectedLabel : "Selecione a turma"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder="Procurar..."
            className="h-9"
            value={inputValue}
            onValueChange={setInputValue}
            onKeyDown={(e) => {
              if (e.key === "Enter" && inputValue) {
                handleSelect(inputValue)
              }
            }}
          />
          <CommandList>
            <CommandEmpty>
              <Button
                variant="ghost"
                className="w-full justify-start px-2 py-1"
                onClick={() => handleSelect(inputValue)}
              >
                Criar: <span className="ml-1 font-semibold">{inputValue}</span>
              </Button>
            </CommandEmpty>
            <CommandGroup>
              {turmas.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={() => handleSelect(framework.value)}
                >
                  {framework.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === framework.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
