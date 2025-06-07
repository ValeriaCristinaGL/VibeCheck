import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Card, CardContent,
    CardHeader, CardTitle,
} from "@/components/ui/card" 
import { ComboboxDemo } from "@/components/ui/comboBox"
import { Label } from "@/components/ui/label"
import { DatePickerWithInputIcon } from "@/components/ui/datePicker"
import { useState } from "react"
import {SuccessCard} from "@/components/ui/successCard"

export function CheckOut({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [musica, setmusica] = useState("")
  const [codigoGerado, setCodigoGerado] = useState<string | null>(null);


  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setCodigoGerado("ABC123"); // Aqui pode ser um código gerado dinamicamente

    const dadosFormulario = {
      musica,
      data: selectedDate.toLocaleDateString("pt-BR")
    };
    console.log("Dados do formulário:", dadosFormulario);
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
            <div className="flex flex-col gap-2">
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

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="turma"
                className="text-muted-foreground"
                style={{ color: "#fff" }}
              >
                Turma
              </Label>
              <ComboboxDemo/>
            </div>

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="musica"
                className="text-muted-foreground"
                style={{ color: "#fff" }}
              >
                Tipo de música usado na aula
              </Label>
              <Input
                    placeholder="Informe o tipo de musica"
                    value={musica}
                    onChange={(e) => setmusica(e.target.value)}
                    className="bg-[#4A4A4A] placeholder:text-[#A0A0A0] text-white border border-[#394779]"
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
              {codigoGerado && <SuccessCard codigo={codigoGerado} />}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}