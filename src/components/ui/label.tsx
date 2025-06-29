import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"

import { cn } from "@/lib/utils"

// Componente Label personalizado que utiliza o Label do Radix UI
function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label" // atributo custom para facilitar estilização ou testes
      className={cn(
        // classes base para estilizar o label
        "flex items-center gap-2 text-sm leading-none font-medium select-none " + 
        // aplica estilos quando o grupo estiver desabilitado (disabled)
        "group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 " +
        // aplica estilos quando o elemento peer estiver desabilitado
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className // classes adicionais passadas por props para customização
      )}
      {...props} // passa todas as outras props para o componente LabelRoot (ex: htmlFor, children, etc.)
    />
  )
}

export { Label }
