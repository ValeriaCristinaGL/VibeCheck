import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Ícones para navegação do calendário
import { DayPicker } from "react-day-picker"; // Componente de calendário pronto

import { cn } from "@/lib/utils"; // Função para concatenar classes CSS condicionalmente
import { buttonVariants } from "@/components/ui/button"; // Estilos reutilizáveis para botões

// Componente Calendar que encapsula o DayPicker com customizações
function Calendar({
  className, // Classe CSS extra para o container principal
  classNames, // Objeto para sobrescrever classes CSS internas do DayPicker
  showOutsideDays = true, // Mostra dias do mês anterior e próximo fora do mês atual (default: true)
  ...props // Outras props do DayPicker (ex: mode, selected, onSelect etc)
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays} // Prop para mostrar os dias externos
      className={cn("p-3", className)} // Padding e classes extras
      classNames={{
        // Customização das classes CSS para as várias partes do calendário
        months: "flex flex-col sm:flex-row gap-2", // Container dos meses (em coluna no mobile, linha em telas maiores)
        month: "flex flex-col gap-4", // Cada mês
        caption: "flex justify-center pt-1 relative items-center w-full", // Cabeçalho do mês (nome + navegação)
        caption_label: "text-sm font-medium", // Texto do mês e ano
        nav: "flex items-center gap-1", // Container dos botões de navegação
        nav_button: cn(
          // Estilo dos botões de navegação usando variantes do botão (outline)
          buttonVariants({ variant: "outline" }),
          "size-7 bg-transparent p-0 opacity-50 hover:opacity-100" // Tamanho, fundo transparente e efeito de opacidade
        ),
        nav_button_previous: "absolute left-1", // Posicionamento do botão anterior (esquerda)
        nav_button_next: "absolute right-1", // Posicionamento do botão próximo (direita)
        table: "w-full border-collapse space-x-1", // Tabela do calendário
        head_row: "flex", // Linha do cabeçalho dos dias da semana
        head_cell:
          "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]", // Células do cabeçalho dos dias (ex: Seg, Ter, Qua)
        row: "flex w-full mt-2", // Linha dos dias do mês
        cell: cn(
          // Células dos dias com estilos para seleção, range etc.
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-range-end)]:rounded-r-md",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        day: cn(
          // Estilo base dos dias, usando variante ghost para botões
          buttonVariants({ variant: "ghost" }),
          "size-8 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_start:
          "day-range-start aria-selected:bg-primary aria-selected:text-primary-foreground", // Início do range selecionado
        day_range_end:
          "day-range-end aria-selected:bg-primary aria-selected:text-primary-foreground", // Fim do range selecionado
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground", // Dia selecionado normal
        day_today: "bg-accent text-accent-foreground", // Dia atual (hoje)
        day_outside:
          "day-outside text-muted-foreground aria-selected:text-muted-foreground", // Dias fora do mês atual (visíveis se showOutsideDays=true)
        day_disabled: "text-muted-foreground opacity-50", // Dias desabilitados (ex: passados)
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground", // Dias do meio do range selecionado
        day_hidden: "invisible", // Dias invisíveis (ex: dias escondidos no mês)
        ...classNames, // Permite sobrescrever qualquer classe via props
      }}
      components={{
        // Ícones personalizados para os botões de navegação (setas esquerda e direita)
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("size-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("size-4", className)} {...props} />
        ),
      }}
      {...props} // Propagação de outras props recebidas para o DayPicker
    />
  );
}

export { Calendar };
