import { useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate()

  // Função para lidar com o submit
  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    navigate("/cadastro"); // Redireciona para a página de check-in
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="text-center border-none">
        <img
          src="/vibe-check-logo.png"
          alt="Logo"
          className="mx-auto mb-4 h-48 w-48"
        />
        <CardHeader>
          <CardTitle style={{ color: "#fff" }}>Entre na sua conta</CardTitle>
          <CardDescription style={{ color: "#fff" }}>
            Conecte-se usando sua conta do Google
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  className="w-full cursor-pointer bg-[#394779] text-white border-none hover:bg-[#3d4381] flex items-center justify-center gap-2"
                >
                  <img src="/google-icon.png" alt="Google" className="w-5 h-5" />
                  Entrar com Google
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
