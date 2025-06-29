// Importações de utilitários, componentes e hooks necessários
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ComboboxDemo } from "@/components/ui/comboBox" // Combobox para selecionar/criar turmas
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { SuccessCard } from "@/components/ui/successCard" // Exibe o código gerado
import { useNavigate } from "react-router-dom" // Para navegação entre páginas

// Componente principal de Check-In
export function CheckIn({ className, ...props }: React.ComponentProps<"div">) {
  // Estados do componente
  const [codigoGerado, setCodigoGerado] = useState<string | null>(null) // Armazena o código gerado após o envio
  const [turma, setTurma] = useState("") // Turma selecionada ou criada
  const [turmas, setTurmas] = useState<string[]>([]) // Lista de turmas carregadas do backend
  const [errors, setErrors] = useState<{ [key: string]: string }>({}) // Armazena mensagens de erro
  const navigate = useNavigate() // Hook de navegação do React Router

  // Função auxiliar para limpar erro de um campo
  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  // Função para encerrar a sessão do usuário
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8080/logout", {
        method: "POST",
        credentials: "include", // Garante que cookies sejam enviados
      })

      if (response.ok) {
        window.location.href = "/" // Redireciona para tela inicial
      } else {
        console.error("Erro ao fazer logout")
      }
    } catch (err) {
      console.error("Erro durante logout:", err)
    }
  }

  // Carrega a lista de turmas do backend quando o componente monta ou turma muda
  useEffect(() => {
    fetch("http://localhost:8080/api/codigo/turmas", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao carregar turmas")
        return res.json()
      })
      .then((data: string[]) => {
        // Ordena alfabeticamente as turmas antes de setar
        setTurmas(data.sort((a, b) => a.localeCompare(b)))
      })
      .catch((err) => {
        console.error(err)
        setErrors((e) => ({ ...e, turma: "Erro ao carregar turmas" }))
      })
  }, [turma])

  // Função chamada ao submeter o formulário
  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    // Validação do campo de turma
    const newErrors: { [key: string]: string } = {}
    if (!turma.trim()) {
      newErrors.turma = "Por favor, selecione ou crie uma turma."
    }

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return // Encerra se houver erro

    // Requisição para gerar o código
    try {
      const response = await fetch(
        "http://localhost:8080/api/codigo/liberar-checkin",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ nomeTurma: turma }), // Envia nome da turma
        }
      )

      if (!response.ok) {
        throw new Error("Erro ao gerar código de check-in")
      }

      const data = await response.json()
      setCodigoGerado(data.codigo) // Armazena o código retornado
      setTurma("") // Limpa o campo de turma
      setErrors({})
    } catch (error) {
      console.error("Erro ao gerar código de check-in:", error)
      setErrors({ geral: "Falha ao liberar check-in. Tente novamente." })
    }
  }

  // Renderização do componente
  return (
    <div className={cn("relative flex flex-col gap-6", className)} {...props}>
      
      {/* Botão para voltar ao dashboard */}
      <Button
        variant="ghost"
        size="icon"
        className="text-white cursor-pointer hover:bg-transparent absolute top-1 left-4 z-10"
        aria-label="Voltar para dashboard"
        onClick={() => navigate("/dashboard")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </Button>

      {/* Botão de logout no canto superior direito */}
      <Button
        variant="destructive"
        onClick={handleLogout}
        className="absolute top-1 right-2 cursor-pointer bg-[#394779] text-white hover:bg-[#3d4381]"
      >
        Encerrar Sessão
      </Button>

      {/* Cartão principal com conteúdo do formulário */}
      <Card className="border-none">
        {/* Logo centralizada */}
        <img
          src="/vibe-check-logo.png"
          alt="Logo"
          className="mx-auto mb-4 h-48 w-48"
        />

        {/* Cabeçalho com título */}
        <CardHeader>
          <CardTitle className="text-white">Check-In</CardTitle>
        </CardHeader>

        <CardContent>
          {/* Formulário principal */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            {/* Campo de seleção de turma */}
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="turma"
                className="text-muted-foreground"
                style={{ color: "#fff" }}
              >
                Turma
              </Label>

              {/* Componente combobox para escolher ou digitar turma */}
              <ComboboxDemo
                value={turma}
                onChange={(value) => {
                  setTurma(value)
                  clearError("turma")
                }}
                items={turmas.map((t) => ({ value: t, label: t }))}
              />

              {/* Mensagem de erro se houver */}
              {errors.turma && (
                <p className="cursor-pointer text-sm text-red-500 mt-1">
                  {errors.turma}
                </p>
              )}
            </div>

            {/* Erro geral (ex: falha na requisição) */}
            {errors.geral && (
              <p className="text-sm text-red-500 mt-2">{errors.geral}</p>
            )}

            {/* Botão de envio e exibição do código gerado */}
            <div className="flex flex-col gap-3 mt-6">
              <Button
                type="submit"
                variant="outline"
                className="w-full cursor-pointer"
                style={{
                  backgroundColor: "#394779",
                  color: "#fff",
                  border: "none",
                }}
              >
                Liberar Check-In
              </Button>

              {/* Exibe o cartão com o código se existir */}
              {codigoGerado && <SuccessCard codigo={codigoGerado} />}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
