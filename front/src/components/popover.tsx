import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"

// Componente raiz do Popover, responsável por gerenciar o estado (aberto/fechado)
function Popover({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

// Componente que define o gatilho (trigger) que abre o Popover
function PopoverTrigger({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

// Componente que renderiza o conteúdo visível do Popover, posicionado próximo ao trigger
function PopoverContent({
  className,
  align = "center",     // alinhamento horizontal do conteúdo em relação ao trigger
  sideOffset = 4,       // distância em pixels do conteúdo em relação ao trigger
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    // Usamos o Portal para renderizar o conteúdo em um nó separado no DOM, facilitando posicionamento
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          // Classes base para estilo do conteúdo
          "bg-white text-gray-900 " +
          "z-[100] w-72 rounded-md border border-gray-200 p-4 shadow-lg outline-none",
          className // classes extras passadas via props
        )}
        {...props} // todas outras props repassadas para o conteúdo do popover
      />
    </PopoverPrimitive.Portal>
  )
}

// Componente para definir uma âncora fixa para posicionamento do Popover, opcionalmente usada para posicionar o conteúdo
function PopoverAnchor({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor }
