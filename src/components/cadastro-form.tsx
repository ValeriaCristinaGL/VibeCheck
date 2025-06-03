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
import { DatePickerWithInputIcon } from "@/components/ui/datePicker"

export function CadastroForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [idade, setIdade] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [sexo, setSexo] = useState<string>("")
  const [resposta, setResposta] = useState<string | null>(null)
  const handleCheckboxChange = (valor: string) => {
    setResposta(prev => (prev === valor ? null : valor))
  }
  const [autoRegular, setAutoRegular] = useState("")
  const [generosGostos, setGenerosGostos] = useState("")
  const [generosNaoGostos, setGenerosNaoGostos] = useState("")

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const dadosFormulario = {
      data: selectedDate.toLocaleDateString("pt-BR"),
      sexo,
      moradorIFPE: resposta,
      autoRegular,
      generosGostos,
      generosNaoGostos,
    }

    console.log("Dados do formulário:", dadosFormulario)

    // Aqui você pode enviar os dados para um backend, limpar o formulário, etc.
  }

  return (
    <div className={cn("flex flex-col gap-6 ", className)} {...props}>
      <Card className="border-none">
        <img
          src="/vibe-check-logo.png"
          alt="Logo"
          className="mx-auto mb-4 h-48 w-48"
        />
        <CardHeader>
          <CardTitle className="text-white">Cadastro</CardTitle>
          <CardDescription className="text-white">
            Insira suas informações para se cadastrar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-6">

              {/* Seleção de Idade */}
              <div className="grid gap-2">
                <Label 
                  htmlFor="idade" 
                  className="text-muted-foreground"
                  style={{ color: "#fff" }}
                >
                  Insira sua data de nascimento
                </Label>
                <DatePickerWithInputIcon
                  value={selectedDate}
                  onChange={setSelectedDate}
                 />
              </div>

              {/* Seleção de Sexo */}
              <div className="grid gap-2">
                <Label
                  htmlFor="sexo"
                  className="text-muted-foreground"
                  style={{ color: "#fff" }}
                >
                  Informe seu sexo
                </Label>
                <Select value={sexo} onValueChange={setSexo}>
                  <SelectTrigger
                    id="sexo"
                    className="w-full bg-[#4A4A4A] text-white border-[#394779]"
                  >
                    <SelectValue placeholder="Selecione seu sexo" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#4A4A4A] text-white border-[#394779]">
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="feminino">Feminino</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                    <SelectItem value="prefiro-nao-dizer">Prefiro não dizer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            <div className="flex flex-col gap-2">
                <Label className="text-white">
                    Você é morador do IFPE?
                </Label>

                <div className="flex gap-6">
                    {/* Checkbox SIM */}
                    <div className="flex items-center gap-2">
                    <Checkbox
                        id="sim"
                        checked={resposta === "sim"}
                        onCheckedChange={() => handleCheckboxChange("sim")}
                        className="border-[#394779] data-[state=checked]:bg-[#394779] data-[state=checked]:border-[#394779]"
                    />
                    <Label htmlFor="sim" className="text-white cursor-pointer">
                        Sim
                    </Label>
                    </div>

                    {/* Checkbox NÃO */}
                    <div className="flex items-center gap-2">
                    <Checkbox
                        id="nao"
                        checked={resposta === "nao"}
                        onCheckedChange={() => handleCheckboxChange("nao")}
                        className="border-[#394779] data-[state=checked]:bg-[#394779] data-[state=checked]:border-[#394779]"
                    />
                    <Label htmlFor="nao" className="text-white cursor-pointer">
                        Não
                    </Label>
                    </div>
                </div>
            </div>
            <div className="grid gap-2">
                <Label
                  className="text-muted-foreground"
                  style={{ color: "#fff" }}
                >
                  Preferências Musicais
                </Label>

                <Input
                    placeholder="Qual te ajuda a se auto-regular"
                    value={autoRegular}
                    onChange={(e) => setAutoRegular(e.target.value)}
                    className="bg-[#4A4A4A] placeholder:text-[#A0A0A0] text-white border border-[#394779]"
                />

                <Input
                    placeholder="Quais gêneros musicais gosta"
                    value={generosGostos}
                    onChange={(e) => setGenerosGostos(e.target.value)}
                    className="bg-[#4A4A4A] placeholder:text-[#A0A0A0] text-white border border-[#394779]"
                />

                <Input
                    placeholder="Quais não gosta"
                    value={generosNaoGostos}
                    onChange={(e) => setGenerosNaoGostos(e.target.value)}
                    className="bg-[#4A4A4A] placeholder:text-[#A0A0A0] text-white border border-[#394779]"
                />
            </div>

              {/* Botão */}
              <div className="flex flex-col gap-3">
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
                  Salvar Informações
                </Button>
              </div>

            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
