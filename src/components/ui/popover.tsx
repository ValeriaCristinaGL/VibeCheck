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
          // Classes base para estilo e animação do conteúdo
          "bg-popover text-popover-foreground " +
          "data-[state=open]:animate-in data-[state=closed]:animate-out " +
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 " +
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 " +
          "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 " +
          "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 " +
          "z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden",
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
