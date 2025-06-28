import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ComboboxDemo } from "@/components/ui/comboBox";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { SuccessCard } from "@/components/ui/successCard";

export function CheckIn({ className, ...props }: React.ComponentProps<"div">) {
  const [codigoGerado, setCodigoGerado] = useState<string | null>(null);
  const [turma, setTurma] = useState("");
  const [turmas, setTurmas] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Função para logout
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8080/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        // Redireciona para a página inicial após logout
        window.location.href = "/";
      } else {
        console.error("Erro ao fazer logout");
      }
    } catch (err) {
      console.error("Erro durante logout:", err);
    }
  };

  // Buscar turmas do backend
  useEffect(() => {
    fetch("http://localhost:8080/api/codigo/turmas", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao carregar turmas");
        return res.json();
      })
      .then((data: string[]) => setTurmas(data))
      .catch((err) => {
        console.error(err);
        setErrors((e) => ({ ...e, turma: "Erro ao carregar turmas" }));
      });
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const newErrors: { [key: string]: string } = {};
    if (!turma.trim()) {
      newErrors.turma = "Por favor, selecione ou crie uma turma.";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const response = await fetch(
        "http://localhost:8080/api/codigo/liberar-checkin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            nomeTurma: turma,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao gerar código de check-in");
      }

      const data = await response.json();
      setCodigoGerado(data.codigo);

      setTurma("");
      setErrors({});
    } catch (error) {
      console.error("Erro ao gerar código de check-in:", error);
      setErrors({ geral: "Falha ao liberar check-in. Tente novamente." });
    }
  }

  return (
    <div className={cn("relative flex flex-col gap-6", className)} {...props}>
      {/* Botão logout fixado no canto superior direito */}
      <Button
        variant="destructive"
        onClick={handleLogout}
        className="absolute top-4 right-4 cursor-pointer bg-[#394779] text-white hover:bg-[#3d4381]"
      >
        Encerrar Sessão
      </Button>

      <Card className="border-none">
        <img
          src="/vibe-check-logo.png"
          alt="Logo"
          className="mx-auto mb-4 h-48 w-48"
        />
        <CardHeader>
          <CardTitle className="text-white">Check-In</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="turma"
                className="text-muted-foreground"
                style={{ color: "#fff" }}
              >
                Turma
              </Label>
              <ComboboxDemo
                value={turma}
                onChange={(value) => {
                  setTurma(value);
                  clearError("turma");
                }}
                items={turmas.map((t) => ({ value: t, label: t }))}
              />
              {errors.turma && (
                <p className="cursor-pointer text-sm text-red-500 mt-1">{errors.turma}</p>
              )}
            </div>

            {errors.geral && (
              <p className="text-sm text-red-500 mt-2">{errors.geral}</p>
            )}

            <div className="flex flex-col gap-3 mt-6">
              <Button
                type="submit"
                variant="outline"
                className="w-full cursor-pointer"
                style={{
                  backgroundColor: "#394779",
                  color: "#fff",
                  border: "none",
                }}
              >
                Liberar Check-In
              </Button>
              {codigoGerado && <SuccessCard codigo={codigoGerado} />}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}