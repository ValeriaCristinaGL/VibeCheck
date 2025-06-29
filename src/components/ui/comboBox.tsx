"use client" // Indica que este componente deve ser renderizado no client-side (React 18+)

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react" // Ícones para check e setas do combobox

import { cn } from "@/lib/utils" // Função para concatenar classes CSS condicionalmente
import { Button } from "@/components/ui/button" // Componente de botão estilizado
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command" // Componentes para criar uma lista de comando/search estilizada
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover" // Componentes para o popover (menu suspenso)

export function ComboboxDemo({
  value,        // Valor atual selecionado no combobox
  onChange,     // Função para informar o valor selecionado para o componente pai
  items,        // Lista de itens possíveis { value, label }
}: {
  value: string
  onChange: (value: string) => void
  items: { value: string, label: string }[]
}) {
  // Estado para controlar se o popover está aberto
  const [open, setOpen] = React.useState(false)

  // Estado para controlar o texto digitado na busca do combobox
  const [inputValue, setInputValue] = React.useState("")

  // Função que dispara ao selecionar um valor (item da lista ou novo texto)
  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue) // Passa o valor selecionado para o componente pai
    setInputValue("")       // Limpa o input de busca
    setOpen(false)          // Fecha o popover
  }

  // Pega o label correspondente ao valor selecionado, ou mostra o próprio valor se não encontrar
  const selectedLabel =
    items.find((f) => f.value === value)?.label || value

  return (
    // Popover controla o menu suspenso, abrindo ou fechando conforme estado open
    <Popover open={open} onOpenChange={setOpen}>
      {/* Botão que dispara o popover */}
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox" // ARIA role para acessibilidade
          aria-expanded={open} // Indica se o combobox está aberto
          className="border-[#394779] bg-[#4A4A4A] hover:bg-[#394779] hover:text-[#fff] text-[#fff] w-full justify-between"
        >
          {/* Mostra o label do item selecionado ou texto padrão */}
          {value ? selectedLabel : "Selecione a turma"}
          {/* Ícone de seta dupla para indicar dropdown */}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      {/* Conteúdo do popover - lista de opções */}
      <PopoverContent className="w-[200px] p-0">
        <Command>
          {/* Campo de input para busca dentro do combobox */}
          <CommandInput
            placeholder="Procurar..."
            className="h-9"
            value={inputValue}
            onValueChange={setInputValue} // Atualiza o texto buscado
            onKeyDown={(e) => {
              // Permite criar uma opção nova ao apertar Enter com texto digitado
              if (e.key === "Enter" && inputValue) {
                handleSelect(inputValue)
              }
            }}
          />

          <CommandList>
            {/* Caso não encontre nenhum item, mostra botão para criar nova opção */}
            {items.filter(t => t.label.toLowerCase().includes(inputValue.toLowerCase())).length === 0 && inputValue && (
              <div className="p-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start px-2 py-1"
                  onClick={() => handleSelect(inputValue)} // Cria nova opção com texto digitado
                >
                  Criar: <span className="ml-1 font-semibold">{inputValue}</span>
                </Button>
              </div>
            )}

            {/* Grupo com as opções filtradas conforme o texto digitado */}
            <CommandGroup>
              {items
                .filter((framework) =>
                  framework.label.toLowerCase().includes(inputValue.toLowerCase())
                )
                .map((framework) => (
                  <CommandItem
                    key={framework.value}
                    value={framework.value}
                    onSelect={() => handleSelect(framework.value)} // Seleciona a opção
                  >
                    {framework.label}
                    {/* Ícone check aparece se o item for o selecionado */}
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
