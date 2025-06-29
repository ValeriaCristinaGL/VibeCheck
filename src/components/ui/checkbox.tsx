import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox" // Importa o componente base de checkbox do Radix UI
import { CheckIcon } from "lucide-react" // Importa o ícone de check (✓)

import { cn } from "@/lib/utils" // Função para concatenar classes CSS condicionalmente

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox" // Atributo customizado para identificar o componente no DOM (útil para testes e estilos)
      className={cn(
        // Classes CSS padrão para o checkbox, com suporte para estado, foco, acessibilidade, tema escuro etc
        "peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className // Permite adicionar classes extras via props
      )}
      {...props} // Repassa outras props para o componente base
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator" // Identificador para o indicador do checkbox (o ícone)
        className="flex items-center justify-center text-current transition-none"
      >
        <CheckIcon className="size-3.5" /> {/* Ícone do check, visível quando marcado */}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
