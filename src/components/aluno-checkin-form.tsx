// Importa hooks e funções do React e bibliotecas auxiliares
import { useNavigate } from "react-router-dom" // para navegação programática
import { useState } from "react" // para manipular estados internos
import { cn } from "@/lib/utils" // função utilitária para concatenar classes CSS condicionalmente
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import Cookies from "js-cookie" // manipulação de cookies no navegador
import {
  Card, CardContent, CardDescription,
  CardHeader, CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"

// Componente principal: tela de check-in do aluno
export function AlunoCheckIn({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate() // hook para redirecionamento
  const [codigo, setcodigo] = useState("") // estado para armazenar o código digitado
  const [errors, setErrors] = useState<{ [key: string]: string }>({}) // objeto para armazenar mensagens de erro por campo

  // Função auxiliar para limpar erro de um campo específico
  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors(prevErrors => {
        const newErrors = { ...prevErrors }
        delete newErrors[field] // remove o erro do campo
        return newErrors
      })
    }
  }

  // Função para encerrar a sessão (logout)
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8080/logout", {
        method: "POST",
        credentials: "include", // inclui cookies na requisição
      });

      if (response.ok) {
        navigate("/"); // redireciona para a página inicial (login)
      } else {
        console.error("Erro ao fazer logout");
      }
    } catch (err) {
      console.error("Erro durante logout:", err);
    }
  };

  // Função chamada quando o formulário é submetido
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // evita recarregamento da página

    const newErrors: { [key: string]: string } = {};

    // Validação: campo obrigatório
    if (!codigo.trim()) {
      newErrors.codigo = "Por favor, informe um código válido.";
    }

    setErrors(newErrors); // define os erros encontrados

    // Se houver erros, cancela a execução
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // Requisição para verificar se o código é válido
    try {
      const response = await fetch(`http://localhost:8080/api/registro/verificar-codigo?codigo=${codigo}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Erro ao verificar o código");
      }

      const valido = await response.json(); // espera um boolean

      if (valido) {
        // Armazena o código em cookie por cerca de 30 minutos
        Cookies.set("codigo_avaliacao", codigo, { expires: 0.02 });
        navigate("/emoji"); // redireciona para a tela de avaliação com emojis
      } else {
        setErrors({ codigo: "Código inválido ou expirado." });
      }

    } catch (error) {
      console.error("Erro ao verificar código:", error);
      setErrors({ codigo: "Erro ao verificar o código. Tente novamente." });
    }
  };

  // JSX da interface do componente
  return (
    <div className={cn("relative flex flex-col gap-6 ", className)} {...props}>
      
      {/* Botão de voltar (ícone de seta) */}
      <Button
        variant="ghost"
        size="icon"
        className="text-white cursor-pointer hover:bg-transparent absolute top-1 left-4 z-10"
        aria-label="Voltar para login"
        onClick={() => navigate("/")}
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
        onClick={() => (handleLogout())}
        className="absolute top-1 right-2 cursor-pointer bg-[#394779] text-white hover:bg-[#3d4381]"
      >
        Encerrar Sessão
      </Button>

      {/* Card central com formulário */}
      <Card className="border-none">
        {/* Logo */}
        <img
          src="/vibe-check-logo.png"
          alt="Logo"
          className="mx-auto mb-4 h-48 w-48"
        />

        <CardHeader>
          <CardTitle className="text-white w-full block">Vamos Iniciar</CardTitle>
          <CardDescription className="text-white w-full block">
            Coloque o código que o professor compartilhou
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                {/* Label do campo */}
                <Label
                  className="text-muted-foreground"
                  style={{ color: "#fff" }}
                >
                  Código
                </Label>

                {/* Campo de entrada do código */}
                <Input
                  placeholder="Código"
                  value={codigo}
                  onChange={(e) => {
                    setcodigo(e.target.value)
                    clearError("codigo") // limpa o erro ao digitar
                  }}
                  className={cn(
                    "bg-[#4A4A4A] placeholder:text-[#A0A0A0] text-white border border-[#394779]",
                    errors.codigo && "border-red-500" // borda vermelha em caso de erro
                  )}
                />

                {/* Exibição de erro abaixo do input */}
                {errors.codigo && (
                  <p className="text-sm text-red-500 mt-1">{errors.codigo}</p>
                )}
              </div>
            </div>

            {/* Botão de envio do formulário */}
            <Button
              type="submit"
              className="w-full bg-[#394779] text-white hover:bg-[#3d4381] cursor-pointer"
            >
              Enviar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
