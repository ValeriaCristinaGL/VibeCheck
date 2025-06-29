import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select, SelectTrigger, SelectValue,
  SelectContent, SelectItem
} from "@/components/ui/select"
import {
  Card, CardContent, CardDescription,
  CardHeader, CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

// Componente de formulário de cadastro
export function CadastroForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate()

  // Estados dos campos do formulário
  const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined)
  const [sexo, setSexo] = useState<string>("")
  const [resposta, setResposta] = useState<string | null>(null)
  const [autoRegular, setAutoRegular] = useState("")
  const [generosGostos, setGenerosGostos] = useState("")
  const [generosNaoGostos, setGenerosNaoGostos] = useState("")
  const [errors, setErrors] = useState<{ [key: string]: string }>({}) // Armazena erros de validação

  // Limpa o erro de um campo específico ao alterar o valor
  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors(prevErrors => {
        const newErrors = { ...prevErrors }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  // Função de envio do formulário
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const newErrors: { [key: string]: string } = {}

    // Validações
    if (!selectedDate) {
      newErrors.selectedDate = "Por favor, selecione uma data do encontro."
    } else if (new Date(selectedDate) > new Date()) {
      newErrors.selectedDate = "A data não pode ser no futuro."
    }

    if (!sexo) {
      newErrors.sexo = "Por favor, informe seu sexo."
    }

    if (!resposta) {
      newErrors.resposta = "Por favor, selecione uma opção para morador do IFPE."
    }

    if (!autoRegular.trim()) {
      newErrors.autoRegular = "Por favor, informe como você se auto-regula."
    }

    if (!generosGostos.trim()) {
      newErrors.generosGostos = "Por favor, informe quais gêneros musicais você gosta."
    }

    if (!generosNaoGostos.trim()) {
      newErrors.generosNaoGostos = "Por favor, informe quais gêneros musicais você não gosta."
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) return // Se houver erros, interrompe

    // Dados finais do formulário
    const dadosFormulario = {
      data: selectedDate,
      sexo,
      moradorIFPE: resposta,
      autoRegular,
      generosGostos,
      generosNaoGostos,
    }

    console.log("Dados do formulário:", dadosFormulario)

    // Limpa os campos após envio
    setSelectedDate(undefined)
    setSexo("")
    setResposta(null)
    setAutoRegular("")
    setGenerosGostos("")
    setGenerosNaoGostos("")
    setErrors({})

    // Redireciona para página de check-in
    navigate("/aluno_check_in")
  }

  // Renderização do formulário
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-none">
        {/* Logo */}
        <img
          src="/vibe-check-logo.png"
          alt="Logo"
          className="mx-auto mb-4 h-48 w-48"
        />

        {/* Cabeçalho do Card */}
        <CardHeader>
          <CardTitle className="text-white">Cadastro</CardTitle>
          <CardDescription className="text-white">
            Insira suas informações para se cadastrar
          </CardDescription>
        </CardHeader>

        {/* Formulário */}
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">

            {/* Data de nascimento */}
            <div className="grid gap-2">
              <Label style={{ color: "#fff" }}>Insira sua data de nascimento</Label>
              <Input
                type="date"
                value={selectedDate ?? ""}
                onChange={(e) => {
                  setSelectedDate(e.target.value)
                  clearError("selectedDate")
                }}
                className={cn(
                  "bg-[#4A4A4A] text-white border border-[#394779]",
                  errors.selectedDate && "border-red-500"
                )}
              />
              {errors.selectedDate && (
                <p className="text-sm text-red-500 mt-1">{errors.selectedDate}</p>
              )}
            </div>

            {/* Sexo */}
            <div className="grid gap-2">
              <Label style={{ color: "#fff" }}>Informe seu sexo</Label>
              <Select value={sexo} onValueChange={(value) => {
                setSexo(value)
                clearError("sexo")
              }}>
                <SelectTrigger
                  className={cn(
                    "bg-[#4A4A4A] text-white border-[#394779]",
                    errors.sexo && "border-red-500"
                  )}
                >
                  <SelectValue placeholder="Selecione seu sexo" />
                </SelectTrigger>
                <SelectContent className="bg-[#4A4A4A] text-white">
                  <SelectItem value="masculino">Masculino</SelectItem>
                  <SelectItem value="feminino">Feminino</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                  <SelectItem value="prefiro-nao-dizer">Prefiro não dizer</SelectItem>
                </SelectContent>
              </Select>
              {errors.sexo && (
                <p className="text-sm text-red-500 mt-1">{errors.sexo}</p>
              )}
            </div>

            {/* Morador do IFPE */}
            <div className="flex flex-col gap-2">
              <Label className="text-white">Você é morador do IFPE?</Label>
              <div className="flex gap-6">
                {/* Checkbox SIM */}
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="sim"
                    checked={resposta === "sim"}
                    onCheckedChange={() => {
                      setResposta(resposta === "sim" ? null : "sim")
                      clearError("resposta")
                    }}
                    className={cn(
                      "border-[#394779]",
                      errors.resposta && "border-red-500"
                    )}
                  />
                  <Label htmlFor="sim" className="text-white">Sim</Label>
                </div>

                {/* Checkbox NÃO */}
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="nao"
                    checked={resposta === "nao"}
                    onCheckedChange={() => {
                      setResposta(resposta === "nao" ? null : "nao")
                      clearError("resposta")
                    }}
                    className={cn(
                      "border-[#394779]",
                      errors.resposta && "border-red-500"
                    )}
                  />
                  <Label htmlFor="nao" className="text-white">Não</Label>
                </div>
              </div>
              {errors.resposta && (
                <p className="text-sm text-red-500 mt-1">{errors.resposta}</p>
              )}
            </div>

            {/* Preferências Musicais */}
            <div className="grid gap-2">
              <Label style={{ color: "#fff" }}>Preferências Musicais</Label>

              {/* Auto-regulação */}
              <Input
                placeholder="Qual te ajuda a se auto-regular"
                value={autoRegular}
                onChange={(e) => {
                  setAutoRegular(e.target.value)
                  clearError("autoRegular")
                }}
                className={cn(
                  "bg-[#4A4A4A] text-white border border-[#394779]",
                  errors.autoRegular && "border-red-500"
                )}
              />
              {errors.autoRegular && (
                <p className="text-sm text-red-500 mt-1">{errors.autoRegular}</p>
              )}

              {/* Gosta */}
              <Input
                placeholder="Quais gêneros musicais gosta"
                value={generosGostos}
                onChange={(e) => {
                  setGenerosGostos(e.target.value)
                  clearError("generosGostos")
                }}
                className={cn(
                  "bg-[#4A4A4A] text-white border border-[#394779]",
                  errors.generosGostos && "border-red-500"
                )}
              />
              {errors.generosGostos && (
                <p className="text-sm text-red-500 mt-1">{errors.generosGostos}</p>
              )}

              {/* Não gosta */}
              <Input
                placeholder="Quais gêneros musicais não gosta"
                value={generosNaoGostos}
                onChange={(e) => {
                  setGenerosNaoGostos(e.target.value)
                  clearError("generosNaoGostos")
                }}
                className={cn(
                  "bg-[#4A4A4A] text-white border border-[#394779]",
                  errors.generosNaoGostos && "border-red-500"
                )}
              />
              {errors.generosNaoGostos && (
                <p className="text-sm text-red-500 mt-1">{errors.generosNaoGostos}</p>
              )}
            </div>

            {/* Botão de envio */}
            <Button
              type="submit"
              className="w-full bg-[#394779] text-white hover:bg-[#3d4381] cursor-pointer"
            >
              Cadastrar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
