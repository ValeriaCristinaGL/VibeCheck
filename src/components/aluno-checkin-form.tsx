import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import Cookies from "js-cookie"
import {
  Card, CardContent, CardDescription,
  CardHeader, CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export function AlunoCheckIn({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate()
  const [codigo, setcodigo] = useState("")

  // Estado para erros
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  // Função para limpar o erro de um campo específico ao digitar/alterar valor
  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors(prevErrors => {
        const newErrors = { ...prevErrors }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newErrors: { [key: string]: string } = {};

    if (!codigo.trim()) {
      newErrors.codigo = "Por favor, informe um código válido.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/registro/verificar-codigo?codigo=${codigo}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Erro ao verificar o código");
      }

      const valido = await response.json();

      if (valido) {
        Cookies.set("codigo_avaliacao", codigo, { expires: 0.02 }); // ~30 minutos
        navigate("/emoji");
      } else {
        setErrors({ codigo: "Código inválido ou expirado." });
      }

    } catch (error) {
      console.error("Erro ao verificar código:", error);
      setErrors({ codigo: "Erro ao verificar o código. Tente novamente." });
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 ", className)} {...props}>
      <Card className="border-none">
        <img
          src="/vibe-check-logo.png"
          alt="Logo"
          className="mx-auto mb-4 h-48 w-48"
        />
        <CardHeader>
          <CardTitle className="text-white w-full block">Vamos Iniciar</CardTitle>
          <CardDescription className="text-white w-full block">
            Coloque o código que o professor compartilhou
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-6">


              {/* Preferências musicais */}
              <div className="grid gap-2">
                <Label
                  className="text-muted-foreground"
                  style={{ color: "#fff" }}
                >
                  Código
                </Label>

                <Input
                  placeholder="Código"
                  value={codigo}
                  onChange={(e) => {
                    setcodigo(e.target.value)
                    clearError("codigo")
                  }}
                  className={cn(
                    "bg-[#4A4A4A] placeholder:text-[#A0A0A0] text-white border border-[#394779]",
                    errors.codigo && "border-red-500"
                  )}
                />
                {errors.codigo && (
                  <p className="text-sm text-red-500 mt-1">{errors.codigo}</p>
                )}

              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-[#394779] text-white hover:bg-[#3d4381] cursor-pointer"
            >
              Enviar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}