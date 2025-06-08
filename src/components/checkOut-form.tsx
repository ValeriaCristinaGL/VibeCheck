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
import { SuccessCard } from "@/components/ui/successCard"

export function CheckOut({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [resetKey, setResetKey] = useState(0);
  const [musica, setMusica] = useState("")
  const [codigoGerado, setCodigoGerado] = useState<string | null>(null);
  const [turma, setTurma] = useState("");

  // Estado para erros
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  // Função para limpar o erro de um campo específico ao digitar/alterar valor
  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors(prevErrors => {
        const newErrors = { ...prevErrors }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  // Validações ao submeter
  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const newErrors: { [key: string]: string } = {}

    if (!selectedDate) {
      newErrors.selectedDate = "Por favor, selecione uma data do encontro."
    } else if (selectedDate > new Date()) {
      newErrors.selectedDate = "A data não pode ser no futuro."
    }

    if (!turma.trim()) {
      newErrors.turma = "Por favor, selecione ou crie uma turma."
    }

    if (!musica.trim()) {
      newErrors.musica = "Por favor, informe o tipo de música usado na aula."
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      return // Não submete se tem erro
    }

    // Se passou na validação
    const codigo = "ABC123"
    setCodigoGerado(codigo)

    const dadosFormulario = {
      musica,
      turma,
      data: selectedDate.toLocaleDateString("pt-BR"),
      codigo,
    }

    console.log("Dados do formulário:", dadosFormulario)

    // Limpar formulário após envio
    setSelectedDate(undefined)
    setResetKey(prev => prev + 1) // força reset
    setMusica("")
    setTurma("")
    setErrors({})
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
                key={resetKey}
                value={selectedDate}
                onChange={(date) => {
                  setSelectedDate(date)
                  clearError("selectedDate")
                }}
                id="date"
              />
              {errors.selectedDate && (
                <p className="text-sm text-red-500 mt-1">{errors.selectedDate}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="turma"
                className="text-muted-foreground"
                style={{ color: "#fff" }}
              >
                Turma
              </Label>
              <ComboboxDemo
                value={turma}
                onChange={(value) => {
                  setTurma(value)
                  clearError("turma")
                }}
              />
              {errors.turma && (
                <p className="text-sm text-red-500 mt-1">{errors.turma}</p>
              )}
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
                id="musica"
                placeholder="Informe o tipo de musica"
                value={musica}
                onChange={(e) => {
                  setMusica(e.target.value)
                  clearError("musica")
                }}
                className={cn(
                  "bg-[#4A4A4A] placeholder:text-[#A0A0A0] text-white border border-[#394779]",
                  errors.musica && "border-red-500"
                )}
              />
              {errors.musica && (
                <p className="text-sm text-red-500 mt-1">{errors.musica}</p>
              )}
            </div>

            <div className="flex flex-col gap-3 mt-6">
              <Button
                type="submit"
                variant="outline"
                className="w-full cursor-pointer"
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
