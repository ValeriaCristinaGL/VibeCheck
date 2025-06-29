import * as React from "react";

import { cn } from "@/lib/utils"; // Função para concatenar classes CSS condicionalmente

// Componente Card - container principal do cartão com estilo base
function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card" // Atributo para facilitar estilização ou testes
      className={cn(
        // Classes padrão para fundo, texto, layout flex, espaçamento, borda, sombra e arredondamento
        "bg-[#323232] text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className // Possibilidade de adicionar classes extras via props
      )}
      {...props} // Propagação de outras props (ex: id, estilo inline etc)
    />
  );
}

// Componente CardHeader - cabeçalho do cartão com layout de grid
function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        // Grid com duas linhas automáticas e espaçamento, além de responsividade com container queries
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  );
}

// Componente CardTitle - título do cartão com fonte negrito e espaçamento compacto
function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  );
}

// Componente CardDescription - descrição com texto menor e cor atenuada
function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

// Componente CardAction - área para ações do cartão (ex: botões) posicionada no grid
function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        // Ocupa segunda coluna e duas linhas no grid, alinhado ao topo e final horizontalmente
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  );
}

// Componente CardContent - conteúdo principal do cartão com espaçamento horizontal
function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  );
}

// Componente CardFooter - rodapé do cartão com alinhamento e espaçamento
function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  );
}

// Exporta todos os componentes para serem usados modularmente
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
