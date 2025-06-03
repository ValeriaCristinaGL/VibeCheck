import * as React from "react";
import { format, parse, isValid } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

interface DatePickerWithInputIconProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
}

export function DatePickerWithInputIcon({
  className,
  value,
  onChange,
}: DatePickerWithInputIconProps) {
  const [inputValue, setInputValue] = React.useState(
    value ? format(value, "dd/MM/yyyy") : ""
  );

  React.useEffect(() => {
    if (value) {
      setInputValue(format(value, "dd/MM/yyyy"));
    }
  }, [value]);

  // Função que formata para dd/MM/yyyy enquanto digita
  function formatDate(value: string) {
    // Remove tudo que não é número
    const digits = value.replace(/\D/g, "").slice(0, 8);

    let formatted = "";

    if (digits.length > 0) {
      formatted += digits.substring(0, 2);
    }
    if (digits.length >= 3) {
      formatted += "/" + digits.substring(2, 4);
    }
    if (digits.length >= 5) {
      formatted += "/" + digits.substring(4, 8);
    }

    return formatted;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;

    // Formata o valor
    const formattedValue = formatDate(rawValue);

    setInputValue(formattedValue);

    // Tenta converter para Date válido
    const parsedDate = parse(formattedValue, "dd/MM/yyyy", new Date());

    if (isValid(parsedDate) && formattedValue.length === 10) {
      onChange?.(parsedDate);
    } else {
      onChange?.(undefined);
    }
  };

  const handleSelect = (selectedDate?: Date) => {
    if (selectedDate) {
      const formatted = format(selectedDate, "dd/MM/yyyy");
      setInputValue(formatted);
      onChange?.(selectedDate);
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <div className="relative w-full">
          <Input
            placeholder="dd/mm/aaaa"
            value={inputValue}
            onChange={handleInputChange}
            maxLength={10}
            className="pl-10 bg-[#394779] text-white border-none placeholder:text-muted-foreground"
          />
          <PopoverTrigger asChild>
            <CalendarIcon
              className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white cursor-pointer"
              strokeWidth={1.8}
            />
          </PopoverTrigger>
        </div>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={handleSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
