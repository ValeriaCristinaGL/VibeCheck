import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card, CardContent,
    CardHeader, CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { DatePickerWithInputIcon } from "@/components/ui/datePicker"
import { useState } from "react"

export function CheckOut({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (selectedDate) {
      console.log("Data selecionada:", selectedDate.toLocaleDateString("pt-BR"),);
      //alert(`Check-Out registrado para: ${selectedDate.toLocaleDateString("pt-BR")}`);
      // Aqui você pode enviar para uma API, banco de dados, etc.
    } else {
      alert("Por favor, selecione uma data.");
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-none">
        <img
          src="/vibe-check-logo.png"
          alt="Logo"
          className="mx-auto mb-4 h-48 w-48"
        />
        <CardHeader>
          <CardTitle className="text-white">Check-Out</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-6">
              <Label
                htmlFor="date"
                className="text-muted-foreground"
                style={{ color: "#fff" }}
              >
                Data do Encontro
              </Label>
              <DatePickerWithInputIcon
                value={selectedDate}
                onChange={setSelectedDate}
              />
            </div>
            <div className="flex flex-col gap-3 mt-6">
              <Button
                type="submit"
                variant="outline"
                className="w-full"
                style={{
                  backgroundColor: "#394779",
                  color: "#fff",
                  border: "none"
                }}
              >
                Liberar Check-Out
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}