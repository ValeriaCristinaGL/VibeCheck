import * as React from "react"; 
import { Slot } from "@radix-ui/react-slot"; 
import { cva, type VariantProps } from "class-variance-authority"; 

import { cn } from "@/lib/utils"; // Função para concatenar classes condicionalmente

// Definição das variantes de estilo para o botão usando class-variance-authority (cva)
// cva gera classes CSS dinâmicas com base nas variantes (variant, size)
const buttonVariants = cva(
  // Estilos base comuns para todos os botões
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      // Variantes visuais do botão
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      // Variantes de tamanho do botão
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3", // altura e padding padrão, ajuste para SVG filhos
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9", // tamanho específico para ícones
      },
    },
    // Variantes padrão se nenhuma for passada
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// Componente Button reutilizável e estilizado
function Button({
  className, // Classes extras personalizadas
  variant, // Variante visual (ex: default, destructive)
  size, // Tamanho do botão (ex: default, sm, lg, icon)
  asChild = false, // Se true, renderiza o botão como um componente filho (Slot)
  ...props // Demais props passadas (ex: onClick, type)
}: React.ComponentProps<"button"> & // Props nativas de button HTML
  VariantProps<typeof buttonVariants> & { // Props geradas pelas variantes do cva
    asChild?: boolean; // Prop custom para trocar o elemento raiz
  }) {
  // Se asChild for true, usa Slot para injetar o botão em outro componente, senão usa <button> normal
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button" // atributo para identificação do slot
      className={cn(buttonVariants({ variant, size, className }))} // concatena classes geradas pelo cva com classes extras
      {...props} // passa demais props para o componente raiz
    />
  );
}

export { Button, buttonVariants };
