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

export function EmojiForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);

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

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!selected) return;

    const codigo = Cookies.get("codigo_avaliacao");

    if (!codigo) {
      alert("Código de avaliação não encontrado. Por favor, volte e insira novamente.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/registro/registrar?codigo=${codigo}&emocao=${parseInt(selected)}`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Erro ao registrar emoção");
      }

      Cookies.remove("codigo_avaliacao");
      navigate("/comfirmacao");
    } catch (error) {
      console.error("Erro ao enviar emoção:", error);
      alert("Erro ao registrar emoção. Tente novamente.");
    }
  }

  return (
    <div className={cn("relative flex flex-col gap-6", className)} {...props}>
      {/* Top bar: seta e logout alinhados como na dashboard */}
      <div className="flex flex-row justify-between items-center w-full">
        <Button
          variant="ghost"
          size="icon"
          className="text-white cursor-pointer hover:bg-transparent mt-1 ml-4"
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
        <Button
          variant="destructive"
          onClick={() => (window.location.href = "/")}
          className="absolute top-1 right-2 cursor-pointer bg-[#394779] text-white hover:bg-[#3d4381]"
        >
          Encerrar Sessão
        </Button>
      </div>
      <Card className="border-none">
        <img
          src="/vibe-check-logo.png"
          alt="Logo"
          className="mx-auto mb-4 h-48 w-48"
        />
        <CardHeader>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-white">
              Qual emoji representa suas emoções agora?
            </span>
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
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-3 gap-4">
              {emojis.map((emoji) => (
                <button
                  key={emoji.id}
                  type="button"
                  onClick={() => setSelected(emoji.id)}
                  className={`flex flex-col items-center justify-center gap-1 p-2 rounded-xl border 
                    ${selected === emoji.id ? "bg-[#394779] border-[#394779]" : "bg-[#4A4A4A] border-[#394779]"}
                    hover:brightness-110 transition`}
                >
                  <img src={emoji.src} alt={emoji.label} className="w-12 h-12" />
                  <span className="font-bold text-xs text-[#fff] text-center break-words whitespace-normal max-w-[90px]">
                    {emoji.label}
                  </span>
                </button>
              ))}
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
                disabled={!selected}
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