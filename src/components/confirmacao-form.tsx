import { useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export function ConfirmacaoForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const navigate = useNavigate()
    // Função para lidar com o submit
  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    navigate("/check"); // Redireciona para a página de check-in
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="text-center border-none relative">
        {/* Botão logout alinhado à direita, 2rem acima da logo */}
        <Button
          variant="destructive"
          onClick={() => (window.location.href = "/")}
          className="absolute right-2 top-0 md:top-4 cursor-pointer bg-[#394779] text-white hover:bg-[#3d4381]"
        >
          Encerrar Sessão
        </Button>
        {/* Logo do app */}
        <div className="w-fit mx-auto">
          <img
            src="/vibe-check-logo.png"
            alt="Logo Vibe Check"
            className="mx-auto mt-8 h-40 w-40"
          />
        </div>

        {/* Mensagem de confirmação */}
        <CardHeader>
          <h2 className="text-xl font-semibold text-white">
            Vibe Check finalizada com sucesso!
          </h2>
        </CardHeader>

        {/* Ícone de sucesso */}
        <CardContent>
          <div className="flex flex-col gap-6 mb-5">
            <CheckCircle2
              className="mx-auto h-32 w-32 stroke-[1.5] text-green-600 animate-pulse"
            />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <Button
                type="submit"
                className="w-full cursor-pointer bg-[#394779] text-white border-none hover:bg-[#3d4381] flex items-center justify-center gap-2"
              >
                Iniciar outra prática
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
