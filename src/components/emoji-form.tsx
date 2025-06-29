import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardHeader,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Info } from "lucide-react";
import { useState } from "react";
import Cookies from "js-cookie";

// Componente principal EmojiForm
export function EmojiForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  // Hook do React Router para navegação programática
  const navigate = useNavigate();

  // Estado para armazenar qual emoji está selecionado (id do emoji)
  const [selected, setSelected] = useState<string | null>(null);

  // Array contendo os emojis disponíveis, com id, texto e caminho da imagem
  const emojis = [
    { id: "1", label: "Muito Feliz", src: "/1.svg" },
    { id: "2", label: "Feliz", src: "/2.svg" },
    { id: "3", label: "Desmotivado", src: "/3.svg" },
    { id: "4", label: "Indiferente", src: "/4.svg" },
    { id: "5", label: "Surpreso", src: "/5.svg" },
    { id: "6", label: "Triste", src: "/6.svg" },
    { id: "7", label: "Irritado", src: "/7.svg" },
    { id: "8", label: "Ansioso", src: "/8.svg" },
    { id: "9", label: "Apaixonado", src: "/9.svg" },
  ];

  // Função para enviar o emoji selecionado para o backend
  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault(); // Evita recarregar a página no submit

    if (!selected) return; // Se nenhum emoji selecionado, não faz nada

    // Pega o código da avaliação do cookie armazenado no navegador
    const codigo = Cookies.get("codigo_avaliacao");

    // Se o cookie não existir, alerta o usuário para voltar e inserir código
    if (!codigo) {
      alert("Código de avaliação não encontrado. Por favor, volte e insira novamente.");
      return;
    }

    try {
      // Envia requisição POST para registrar a emoção
      const response = await fetch(
        `http://localhost:8080/api/registro/registrar?codigo=${codigo}&emocao=${parseInt(selected)}`,
        {
          method: "POST",
          credentials: "include", // Envia cookies junto com a requisição
        }
      );

      // Se o servidor retornar erro, lança exceção para tratar no catch
      if (!response.ok) {
        throw new Error("Erro ao registrar emoção");
      }

      // Remove o cookie de código após registro bem-sucedido
      Cookies.remove("codigo_avaliacao");

      // Redireciona o usuário para página de confirmação
      navigate("/comfirmacao");
    } catch (error) {
      // Loga erro no console e avisa usuário com alert
      console.error("Erro ao enviar emoção:", error);
      alert("Erro ao registrar emoção. Tente novamente.");
    }
  }

  return (
    // Container principal com classes de estilo e props adicionais
    <div className={cn("relative flex flex-col gap-6", className)} {...props}>
      {/* Barra superior contendo botão voltar e botão logout */}
      <div className="flex flex-row justify-between items-center w-full">
        {/* Botão para voltar à tela inicial/login */}
        <Button
          variant="ghost"
          size="icon"
          className="text-white cursor-pointer hover:bg-transparent mt-1 ml-4"
          aria-label="Voltar para login"
          onClick={() => navigate("/")}
        >
          {/* Ícone SVG da seta para voltar */}
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

        {/* Botão para encerrar sessão, leva para raiz ("/") */}
        <Button
          variant="destructive"
          onClick={() => (window.location.href = "/")}
          className="absolute top-1 right-2 cursor-pointer bg-[#394779] text-white hover:bg-[#3d4381]"
        >
          Encerrar Sessão
        </Button>
      </div>

      {/* Card principal contendo logo, título, explicação e emojis */}
      <Card className="border-none">
        {/* Logo centralizado */}
        <img
          src="/vibe-check-logo.png"
          alt="Logo"
          className="mx-auto mb-4 h-48 w-48"
        />
        <CardHeader>
          <div className="flex items-center gap-4 mb-4">
            {/* Texto explicativo para o usuário */}
            <span className="text-white">
              Qual emoji representa suas emoções agora?
            </span>

            {/* Popover que mostra explicação ao clicar no ícone de informação */}
            <Popover>
              <PopoverTrigger asChild>
                <button aria-label="Informações sobre emojis">
                  <Info className="w-5 h-5 text-[#fff] cursor-pointer" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="bg-[#fff] text-[#000] border-[#394779] w-72">
                <p className="text-sm">
                  Esse emoji nos ajuda a entender suas emoções antes/depois da prática.
                  <br />
                  <strong>Escolha com sinceridade.</strong>
                </p>
              </PopoverContent>
            </Popover>
          </div>
        </CardHeader>

        <CardContent>
          {/* Formulário com seleção de emoji e botão enviar */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Grade 3x3 para exibir todos os emojis */}
            <div className="grid grid-cols-3 gap-4">
              {emojis.map((emoji) => (
                <button
                  key={emoji.id}
                  type="button" // Botões não submetem o formulário ao clicar
                  onClick={() => setSelected(emoji.id)} // Seleciona o emoji clicado
                  className={`flex flex-col items-center justify-center gap-1 p-2 rounded-xl border 
                    ${selected === emoji.id ? "bg-[#394779] border-[#394779]" : "bg-[#4A4A4A] border-[#394779]"}
                    hover:brightness-110 transition`} // Estilo diferente para emoji selecionado
                >
                  {/* Imagem do emoji */}
                  <img src={emoji.src} alt={emoji.label} className="w-12 h-12" />
                  {/* Label/texto do emoji */}
                  <span className="font-bold text-xs text-[#fff] text-center break-words whitespace-normal max-w-[90px]">
                    {emoji.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Botão enviar desabilitado se nenhum emoji selecionado */}
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
                disabled={!selected} // Desabilita se selected for null
              >
                Enviar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
