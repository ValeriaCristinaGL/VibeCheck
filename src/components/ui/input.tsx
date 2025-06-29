import * as React from "react"

import { cn } from "@/lib/utils"

// Componente Input personalizado que aceita todas as props nativas de um input HTML
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type} // tipo do input, ex: "text", "password", etc.
      data-slot="input" // atributo custom para identificação (usado para estilização ou testes)
      className={cn(
        // classes base para estilo do input
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        // classes para foco visível com anel (outline)
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        // classes para estado de erro usando aria-invalid
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        // classes adicionais recebidas via prop className para customização externa
        className
      )}
      {...props} // passa todas as outras props para o input (ex: placeholder, value, onChange, disabled etc.)
    />
  )
}

export { Input }
