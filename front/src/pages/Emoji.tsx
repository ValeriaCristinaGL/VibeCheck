import { Button } from "@/components/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import { CircleUserRound } from "lucide-react";
import toast from "react-hot-toast";

type AvaliacaoTipo = "checkin" | "checkout";

export default function EmojiPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);
  const [tipoAvaliacao, setTipoAvaliacao] = useState<AvaliacaoTipo | null>(null);

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

  useEffect(() => {
    const tipoCookie = Cookies.get("tipo_avaliacao");
    if (tipoCookie === "checkin" || tipoCookie === "checkout") {
      setTipoAvaliacao(tipoCookie);
    }

    const codigo = Cookies.get("codigo_avaliacao");
    if (!codigo) return;

    const syncTipo = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/avaliacao/verificar-codigo?codigo=${codigo}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) return;

        const data = await response.json();
        const tipoRaw = data?.tipo ?? data?.Tipo ?? data?.tipoAvaliacao ?? data?.TipoAvaliacao;

        let tipoNormalizado: "checkin" | "checkout" | null = null;
        if (typeof tipoRaw === "string") {
          const lower = tipoRaw.toLowerCase();
          if (lower.includes("checkin")) tipoNormalizado = "checkin";
          if (lower.includes("checkout")) tipoNormalizado = "checkout";
        } else if (typeof tipoRaw === "number") {
          if (tipoRaw === 0) tipoNormalizado = "checkin";
          if (tipoRaw === 1) tipoNormalizado = "checkout";
        }

        if (tipoNormalizado) {
          setTipoAvaliacao(tipoNormalizado);
          Cookies.set("tipo_avaliacao", tipoNormalizado, { expires: 0.02 });
        }
      } catch {
        // Mantem fallback de cookie quando a validacao falha.
      }
    };

    void syncTipo();
  }, []);

  const tituloBotao = useMemo(
    () => {
      if (tipoAvaliacao === "checkout") return "Enviar Check-out";
      if (tipoAvaliacao === "checkin") return "Enviar Check-in";
      return "Enviar Avaliação";
    },
    [tipoAvaliacao]
  );

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!selected) return;

    const codigo = Cookies.get("codigo_avaliacao");

    if (!codigo) {
      toast.error("Código de avaliação não encontrado. Por favor, volte e insira novamente.", { duration: 10000 });
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/RegistroEmocional/registrar?codigo=${codigo}&valorEmocao=${parseInt(selected)}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao registrar emoção");
      }

      Cookies.remove("codigo_avaliacao");
      Cookies.remove("tipo_avaliacao");
      toast.success("Emoção Registrada", { duration: 3000 });
      navigate("/comfirmacao");
    } catch (error) {
      console.error("Erro ao enviar emoção:", error);
      toast.error("Erro ao enviar emoção:", { duration: 3000 });
    }
  }

  // Função para encerrar a sessão (logout)
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        Cookies.remove("codigo_avaliacao");
        Cookies.remove("tipo_avaliacao");
        navigate("/");
      } else {
        console.error("Erro ao fazer logout");
      }
    } catch (err) {
      console.error("Erro durante logout:", err);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#ECECF4]">
      <header className="flex md:hidden w-full items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <h1 className="text-xl font-bold font-montserrat text-[#783E98]">
          VibeCheck
        </h1>
        <button
          onClick={handleLogout}
          className="text-base font-medium font-montserrat text-[#783E98] hover:underline"
        >
          Sair
        </button>
      </header>

      <header className="hidden md:flex w-full items-center justify-between px-8 py-4 shadow-sm bg-white">
        <h1 className="text-xl font-bold font-montserrat text-[#783E98]">
          VibeCheck
        </h1>
        <Button
          className="cursor-pointer bg-[#783E98] font-montserrat font-semibold text-white hover:bg-[#5e3178]"
          onClick={handleLogout}
        >
          Encerrar Sessão
        </Button>
      </header>

      <main className="mx-auto w-full max-w-[460px] flex-1 px-5 pb-24 pt-6 md:max-w-[860px] md:px-8 md:py-8">
        <h1 className="text-center font-montserrat text-3xl font-bold leading-snug text-[#5A2D77] md:text-4xl lg:text-5xl">Emocional</h1>

        <p className="mt-4 font-montserrat text-lg text-[#21212A] md:mt-5 md:text-2xl lg:text-3xl">
          Como está seu humor <span className="font-bold">agora?</span>
        </p>

        <div className="mt-4 rounded-2xl bg-[#DEE0F0] p-1.5 md:mt-5">
          <div className="grid grid-cols-2 gap-1">
            <div
              className={`rounded-xl px-3 py-2.5 text-center font-montserrat text-base font-semibold transition md:px-4 md:text-xl ${
                tipoAvaliacao === "checkin" ? "bg-white text-[#181827] shadow-sm" : "text-[#6D7490]"
              }`}
            >
              Check-in
            </div>
            <div
              className={`rounded-xl px-3 py-2.5 text-center font-montserrat text-base font-semibold transition md:px-4 md:text-xl ${
                tipoAvaliacao === "checkout" ? "bg-white text-[#181827] shadow-sm" : "text-[#6D7490]"
              }`}
            >
              Check-out
            </div>
          </div>
        </div>

        <section className="mt-6 rounded-3xl bg-[#F8F8FA] p-5 shadow-[0_3px_10px_rgba(29,29,61,0.16)] md:mt-7 md:p-6">
          <p className="mb-4 font-montserrat text-base text-[#3B3B44] md:text-lg lg:text-xl">
            Selecione o emoji que melhor representa seu humor atual
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              {emojis.map((emoji) => {
                const isSelected = selected === emoji.id;
                return (
                  <button
                    key={emoji.id}
                    type="button"
                    onClick={() => setSelected(emoji.id)}
                    className={`flex h-24 flex-col items-center justify-center rounded-2xl border-2 bg-white px-1 py-2 transition md:h-28 ${
                      isSelected ? "border-[#5C2D77]" : "border-[#C5C8D8]"
                    }`}
                  >
                    <img src={emoji.src} alt={emoji.label} className="h-9 w-9 md:h-10 md:w-10" />
                    <span className="mt-1.5 w-full max-w-[88px] break-words text-center font-montserrat text-xs leading-tight text-[#21212A] sm:text-sm md:max-w-[120px] md:text-base">
                      {emoji.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <Button
              className="h-12 w-full rounded-xl bg-[#5A2D77] px-3 font-montserrat text-base font-semibold text-white hover:bg-[#4D2666] md:h-14 md:text-lg"
              type="submit"
              disabled={!selected}
            >
              {tituloBotao}
            </Button>
          </form>
        </section>
      </main>

      <footer className="fixed inset-x-0 bottom-0 border-t border-[#D0D0DB] bg-[#F5F5F7] md:hidden">
        <div className="mx-auto flex h-[72px] w-full max-w-[460px] items-center justify-center px-6">
          <button type="button" className="flex flex-col items-center gap-1 text-[#5A2D77]">
            <CircleUserRound size={20} />
            <span className="font-montserrat text-sm font-semibold">Avaliação</span>
          </button>
        </div>
      </footer>
    </div>
  );
}