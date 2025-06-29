import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ComboboxDemo } from "@/components/ui/comboBox";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { SuccessCard } from "@/components/ui/successCard";
import { useNavigate } from "react-router-dom"; // Hook para navegação entre páginas

export function CheckOut({ className, ...props }: React.ComponentProps<"div">) {
  // Estado para armazenar o código gerado após liberação do checkout
  const [codigoGerado, setCodigoGerado] = useState<string | null>(null);
  // Estado para armazenar a turma selecionada no combobox
  const [turma, setTurma] = useState("");
  // Estado que guarda todas as turmas obtidas do backend
  const [turmas, setTurmas] = useState<string[]>([]);
  // Estado para armazenar mensagens de erro associadas a campos ou erros gerais
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  // Hook para navegar entre rotas do React Router
  const navigate = useNavigate();

  // Hook para buscar turmas no backend sempre que a turma mudar (ou na montagem)
  useEffect(() => {
    fetch("http://localhost:8080/api/codigo/turmas", {
      credentials: "include", // Envia cookies para autenticação se necessário
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao carregar turmas");
        return res.json();
      })
      .then((data: string[]) =>
        setTurmas(data.sort((a, b) => a.localeCompare(b))) // Ordena alfabeticamente
      )
      .catch((err) => {
        console.error(err);
        setErrors((e) => ({ ...e, turma: "Erro ao carregar turmas" })); // Mensagem de erro ao carregar turmas
      });
  }, [turma]);

  // Função para limpar erro específico ao modificar um campo
  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Função para fazer logout e redirecionar para a página inicial
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8080/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        window.location.href = "/"; // Redireciona após logout
      } else {
        console.error("Erro ao fazer logout");
      }
    } catch (err) {
      console.error("Erro durante logout:", err);
    }
  };

  // Função executada no submit do formulário para liberar o check-out
  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    // Validação simples: turma não pode estar vazia
    const newErrors: { [key: string]: string } = {};
    if (!turma.trim()) {
      newErrors.turma = "Por favor, selecione ou crie uma turma.";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return; // Para o envio se houver erros

    try {
      // Requisição POST para liberar check-out na turma selecionada
      const response = await fetch("http://localhost:8080/api/codigo/liberar-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          nomeTurma: turma,
        }),
      });

      if (!response.ok) throw new Error("Erro ao gerar código de check-out");

      const data = await response.json();
      setCodigoGerado(data.codigo); // Guarda o código retornado no estado

      // Limpa a turma e erros após sucesso
      setTurma("");
      setErrors({});
    } catch (error) {
      console.error("Erro ao gerar código de check-out:", error);
      setErrors({ geral: "Falha ao liberar check-out. Tente novamente." }); // Erro geral exibido para o usuário
    }
  }

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

      {/* Botão para logout fixado no canto superior direito */}
      <Button
        variant="destructive"
        onClick={handleLogout}
        className="absolute top-1 right-2 cursor-pointer bg-[#394779] text-white hover:bg-[#3d4381]"
      >
        Encerrar Sessão
      </Button>

      {/* Card principal contendo o formulário */}
      <Card className="border-none">
        {/* Logo centralizado */}
        <img
          src="/vibe-check-logo.png"
          alt="Logo"
          className="mx-auto mb-4 h-48 w-48"
        />

        {/* Cabeçalho do card */}
        <CardHeader>
          <CardTitle className="text-white">Check-Out</CardTitle>
        </CardHeader>

        {/* Conteúdo do card */}
        <CardContent>
          {/* Formulário para selecionar turma e liberar check-out */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Campo de seleção da turma */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="turma" className="text-muted-foreground" style={{ color: "#fff" }}>
                Turma
              </Label>
              <ComboboxDemo
                value={turma}
                onChange={(value) => {
                  setTurma(value);
                  clearError("turma");
                }}
                items={turmas.map((t) => ({ value: t, label: t }))}
              />
              {/* Mensagem de erro para turma */}
              {errors.turma && (
                <p className="text-sm text-red-500 mt-1">{errors.turma}</p>
              )}
            </div>

            {/* Mensagem de erro geral */}
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
                Liberar Check-Out
              </Button>
              {/* Cartão de sucesso exibindo o código */}
              {codigoGerado && <SuccessCard codigo={codigoGerado} />}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
