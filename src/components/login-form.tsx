import { cn } from "@/lib/utils"; // Função para concatenar classes CSS condicionalmente
import { Button } from "@/components/ui/button"; // Componente de botão estilizado
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // Componentes para layout de cartão (card)

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  // Componente funcional React que recebe props padrão para <div>, incluindo className

  return (
    // Container principal com flex vertical e espaçamento entre elementos
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {/* Cartão centralizado sem borda */}
      <Card className="text-center border-none">
        {/* Logo centralizado, com margem inferior e tamanho fixo */}
        <img
          src="/vibe-check-logo.png"
          alt="Logo"
          className="mx-auto mb-4 h-48 w-48"
        />
        {/* Cabeçalho do cartão com título e descrição */}
        <CardHeader>
          {/* Título do card com cor branca */}
          <CardTitle style={{ color: "#fff" }}>Entre na sua conta</CardTitle>
          {/* Descrição com texto explicativo também em branco */}
          <CardDescription style={{ color: "#fff" }}>
            Conecte-se usando sua conta do Google
          </CardDescription>
        </CardHeader>
        {/* Conteúdo do cartão, onde fica o formulário */}
        <CardContent>
          {/* Formulário (sem inputs neste caso) */}
          <form>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                {/* Botão para login via Google */}
                <Button
                  variant="outline" // Estilo outline (borda)
                  className="w-full bg-[#394779] text-white hover:bg-[#3d4381] hover:text-white border-none cursor-pointer"
                  type="button" // Botão normal (não submit)
                  onClick={() => window.location.href = "http://localhost:8080/login"} // Redireciona para endpoint de login
                >
                  Entrar com Google
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}