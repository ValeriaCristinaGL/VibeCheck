import { Button } from "@/components/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function HomePage() {
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    window.location.href = "http://localhost:8080/api/auth/login";
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col-reverse items-center justify-center gap-4 px-8 py-10 md:flex-row md:gap-20 md:py-16">
        <div className="flex max-w-xl flex-col items-center gap-5 text-center md:items-start md:gap-12 md:text-left">
          <h1
            style={{ lineHeight: "1.4" }}
            className="font-unbounded text-2xl font-light leading-snug text-[#7032C7] md:text-4xl lg:text-5xl"
          >
            Transforme suas
            <br />
            emoções em
            <br />
            <span className="font-bold text-[#7032C7]">Bem-Estar</span>
          </h1>

          <div className="w-full max-w-[350px] space-y-4">
            <Button
              aria-label="Entrar com conta do Google"
              variant="outline"
              type="button"
              className="h-12 w-full rounded-xl border border-[#9C5CD4] bg-[#7D44B1] px-4 text-[15px] font-bold tracking-[-0.01em] text-white shadow-none hover:bg-[#8750bb]"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2 font-montserrat text-[15px] font-semibold">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Conectando...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-3 font-montserrat text-[15px] font-semibold">
                  <img src="/google-icon.png" alt="Google" className="h-5 w-5" />
                  Entrar com o Google
                </span>
              )}
            </Button>
          </div>
        </div>

        <div className="max-w-[260px] md:max-w-lg">
          <img
            src="/figura.svg"
            alt="Pessoa ouvindo música"
            className="h-auto w-full rounded-[2rem] object-cover"
          />
        </div>
      </main>

      <footer className="w-full pb-6 pt-2 text-center md:pb-8 md:pt-3">
        <h2 className="font-unbounded text-xl font-bold tracking-[-0.02em] text-[#7032C7]">VibeCheck</h2>
      </footer>
    </div>
  );
}