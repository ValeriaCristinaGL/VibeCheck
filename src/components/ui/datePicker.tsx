"use client"

import * as React from "react"
import { format, parse, isValid } from "date-fns" // funções para manipulação de datas
import { Calendar as CalendarIcon } from "lucide-react" // ícone de calendário

import { cn } from "@/lib/utils" // função para concatenar classes CSS condicionalmente
import { Calendar } from "@/components/ui/calendar" // componente de calendário customizado
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover" // componentes para popover (tooltip/modal)
import { Input } from "@/components/ui/input" // componente de input customizado

// Definição das props do componente, extendendo div mas omitindo onChange para redefinir
interface DatePickerWithInputIconProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: Date // valor atual do datepicker (objeto Date)
  onChange?: (date: Date | undefined) => void // callback para quando a data mudar (ou for apagada)
}

export function DatePickerWithInputIcon({
  className,
  value,
  onChange,
}: DatePickerWithInputIconProps) {
  // Estado para manter o valor do input como string formatada (dd/MM/yyyy)
  const [inputValue, setInputValue] = React.useState(
    value ? format(value, "dd/MM/yyyy") : ""
  );

  // Atualiza o inputValue se a prop value mudar externamente
  React.useEffect(() => {
    if (value) {
      setInputValue(format(value, "dd/MM/yyyy"));
    }
  }, [value]);

  // Função que formata o texto do input enquanto o usuário digita (dd/MM/yyyy)
  function formatDate(value: string) {
    // Remove qualquer caractere que não seja número e limita a 8 dígitos (ddMMyyyy)
    const digits = value.replace(/\D/g, "").slice(0, 8);

    let formatted = "";

    if (digits.length > 0) {
      formatted += digits.substring(0, 2); // adiciona dia
    }
    if (digits.length >= 3) {
      formatted += "/" + digits.substring(2, 4); // adiciona mês com barra
    }
    if (digits.length >= 5) {
      formatted += "/" + digits.substring(4, 8); // adiciona ano com barra
    }

    return formatted;
  }

  // Função chamada ao mudar o valor do input (ao digitar)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value; // valor bruto do input

    // Aplica formatação para dd/MM/yyyy enquanto digita
    const formattedValue = formatDate(rawValue);

    setInputValue(formattedValue); // atualiza estado do input

    // Se o input estiver vazio, avisa que a data foi apagada
    if (formattedValue.length === 0) {
      onChange?.(undefined);
      return;
    }

    // Tenta converter string formatada para objeto Date válido
    const parsedDate = parse(formattedValue, "dd/MM/yyyy", new Date());

    // Se a data é válida e tem tamanho completo (10 caracteres), chama onChange com a data
    if (isValid(parsedDate) && formattedValue.length === 10) {
      onChange?.(parsedDate);
    } else {
      // Se inválida ou incompleta, chama onChange com undefined
      onChange?.(undefined);
    }
  };

  // Função chamada ao selecionar uma data pelo calendário
  const handleSelect = (selectedDate?: Date) => {
    if (selectedDate) {
      const formatted = format(selectedDate, "dd/MM/yyyy"); // formata a data
      setInputValue(formatted); // atualiza texto do input
      onChange?.(selectedDate); // avisa o pai da nova data selecionada
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      {/* Popover que envolve o input e o calendário */}
      <Popover>
        <div className="relative w-full">
          {/* Input de texto para digitar a data */}
          <Input
            placeholder="dd/mm/aaaa"
            value={inputValue} // valor formatado para exibir no input
            onChange={handleInputChange} // função que trata a digitação
            maxLength={10} // limite de caracteres para dd/MM/yyyy
            className="pl-10 bg-[#4A4A4A] text-white border border-[#394779] placeholder:text-muted-foreground"
          />
          {/* Ícone de calendário que abre o popover */}
          <PopoverTrigger asChild>
            <CalendarIcon
              className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground cursor-pointer"
              strokeWidth={1.8}
            />
          </PopoverTrigger>
        </div>

        {/* Conteúdo do popover: o calendário para seleção */}
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single" // seleção única
            selected={value} // data selecionada atual
            onSelect={handleSelect} // função para atualizar ao selecionar data no calendário
            initialFocus // foco automático ao abrir
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
