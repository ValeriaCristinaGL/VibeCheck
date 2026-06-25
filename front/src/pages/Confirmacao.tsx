import { Button } from "@/components/button";
import { useNavigate } from "react-router-dom";
import { CircleCheckBig, CircleUserRound } from "lucide-react";

export default function ConfirmacaoPage() {
  const navigate = useNavigate()

  // Função para encerrar a sessão (logout)
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/logout", {
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

  return (
    <div className="flex min-h-screen flex-col bg-[#ECECF4]" >
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

        <nav className="flex items-center gap-4">
          <Button
            className="cursor-pointer bg-[#783E98] font-montserrat font-semibold text-white hover:bg-[#5e3178]"
            onClick={handleLogout}
          >
            Encerrar Sessão
          </Button>
        </nav>
      </header>

      <main className="mx-auto flex w-full max-w-[460px] flex-1 flex-col justify-between px-5 pb-24 pt-16 md:max-w-[860px] md:pb-10">
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <CircleCheckBig className="h-24 w-24 text-[#22C55E]" strokeWidth={1.8} />
          <p className="mt-10 font-montserrat text-3xl font-light leading-snug text-[#5A2D77] md:text-4xl lg:text-5xl">
            VibeCheck
          </p>
          <h2 className="font-montserrat text-4xl font-bold leading-tight text-[#5A2D77] md:text-5xl lg:text-6xl">
            Finalizada!
          </h2>
        </div>

        <Button
          className="mb-4 h-12 w-full rounded-xl bg-[#5A2D77] font-montserrat text-base font-semibold text-white hover:bg-[#4D2666] md:text-lg"
          type="button"
          onClick={() => navigate("/check")}
        >
          Iniciar outra prática
        </Button>
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