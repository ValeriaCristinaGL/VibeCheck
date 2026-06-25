import { Button } from "@/components/button";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import Cookies from "js-cookie";
import { CircleUserRound } from "lucide-react";
import toast from "react-hot-toast";

export default function AlunoCheckInPage() {
  const navigate = useNavigate() // hook para redirecionamento
  const [codigoDigits, setCodigoDigits] = useState<string[]>(Array(6).fill(""));
  const [codigoErro, setCodigoErro] = useState<string | null>(null);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const focusInput = (index: number) => {
    const input = inputRefs.current[index];
    if (input) input.focus();
  };

  const updateDigits = (nextDigits: string[]) => {
    setCodigoDigits(nextDigits);
    if (codigoErro) setCodigoErro(null);
  };

  const handleDigitChange = (index: number, value: string) => {
    const sanitized = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (!sanitized) {
      const next = [...codigoDigits];
      next[index] = "";
      updateDigits(next);
      return;
    }

    const next = [...codigoDigits];

    if (sanitized.length > 1) {
      let cursor = index;
      for (const char of sanitized) {
        if (cursor > 5) break;
        next[cursor] = char;
        cursor++;
      }
      updateDigits(next);
      focusInput(Math.min(index + sanitized.length, 5));
      return;
    }

    next[index] = sanitized;
    updateDigits(next);
    if (index < 5) focusInput(index + 1);
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !codigoDigits[index] && index > 0) {
      focusInput(index - 1);
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData("text").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
    if (!pasted) return;
    const next = Array(6).fill("");
    pasted.split("").forEach((char, idx) => {
      next[idx] = char;
    });
    updateDigits(next);
    focusInput(Math.min(pasted.length, 6) - 1);
  };

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

  // Função chamada quando o formulário é submetido
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // evita recarregamento da página

    const codigo = codigoDigits.join("").trim();

    const newErrors: { [key: string]: string } = {};

    if (codigo.length !== 6) {
      toast.error("O código deve ter 6 caracteres.", { duration: 3000 });
      newErrors.codigo = "O código deve ter 6 caracteres.";
    }

    setCodigoErro(newErrors.codigo ?? null);

    // Se houver erros, cancela a execução
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // Requisição para verificar se o código é válido
    try {
      const response = await fetch(`http://localhost:8080/api/avaliacao/verificar-codigo?codigo=${codigo}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        toast.error("Erro ao verificar código:", { duration: 3000 });
        throw new Error("Erro ao verificar o código");
      }

      const resultado = await response.json();
      const valido = typeof resultado === "boolean"
        ? resultado
        : Boolean(resultado?.valido ?? resultado?.Valido);

      const tipoRaw = typeof resultado === "object"
        ? (resultado?.tipo ?? resultado?.Tipo ?? resultado?.tipoAvaliacao ?? resultado?.TipoAvaliacao)
        : null;

      let tipoNormalizado: "checkin" | "checkout" | null = null;
      if (typeof tipoRaw === "string") {
        const lower = tipoRaw.toLowerCase();
        if (lower.includes("checkin")) tipoNormalizado = "checkin";
        if (lower.includes("checkout")) tipoNormalizado = "checkout";
      } else if (typeof tipoRaw === "number") {
        // Fallback para enum serializado como numero (0=Checkin, 1=Checkout).
        if (tipoRaw === 0) tipoNormalizado = "checkin";
        if (tipoRaw === 1) tipoNormalizado = "checkout";
      }

      if (valido) {
        // Armazena o código em cookie por cerca de 30 minutos
        toast.success("Código de válido", { duration: 3000 });
        Cookies.set("codigo_avaliacao", codigo, { expires: 0.02 });
        Cookies.remove("tipo_avaliacao");
        if (tipoNormalizado === "checkin" || tipoNormalizado === "checkout") {
          Cookies.set("tipo_avaliacao", tipoNormalizado, { expires: 0.02 });
        }
        navigate("/emoji"); // redireciona para a tela de avaliação com emojis
      } else {
        toast.error("Código inválido ou expirado.", { duration: 3000 });
        setCodigoErro("Código inválido ou expirado.");
      }
    } catch (error) {
      toast.error("Erro ao verificar código:", { duration: 3000 });
      console.error("Erro ao verificar código:", error);
      setCodigoErro("Erro ao verificar o código. Tente novamente.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5F5]">
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

      <main className="flex flex-1 flex-col items-center px-5 pb-24 pt-10 md:pb-10">
        <div className="w-full max-w-[420px]">
          <h1 className="text-center font-montserrat text-3xl font-bold leading-snug text-[#5A2D77] md:text-4xl lg:text-5xl">
            Vamos iniciar?
          </h1>

          <p className="mt-8 text-center font-montserrat text-base text-[#5A2D77] md:text-xl lg:text-2xl">
            Digite o código que o professor compartilhou
          </p>

          <form className="mt-5" onSubmit={handleSubmit}>
            <div className="mx-auto grid w-full max-w-[290px] grid-cols-6 gap-2">
              {codigoDigits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="text"
                  maxLength={6}
                  value={digit}
                  onChange={(e) => handleDigitChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="h-12 w-full rounded-xl border-2 border-[#5A2D77] bg-transparent text-center font-montserrat text-lg font-semibold text-[#5A2D77] outline-none"
                  aria-label={`Dígito ${index + 1} do código`}
                />
              ))}
            </div>

            {codigoErro && (
              <p className="mt-3 text-center text-sm text-red-500">{codigoErro}</p>
            )}

            <Button
              className="mt-10 h-12 w-full rounded-xl bg-[#5A2D77] font-montserrat text-base font-semibold text-white hover:bg-[#4D2666] md:text-lg"
              type="submit"
            >
              Entrar
            </Button>
          </form>
        </div>
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