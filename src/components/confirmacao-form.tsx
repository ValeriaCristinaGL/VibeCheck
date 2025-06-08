import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

export function ConfirmacaoForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="text-center border-none">
        {/* Logo do app */}
        <img
          src="/vibe-check-logo.png"
          alt="Logo Vibe Check"
          className="mx-auto mt-8 h-40 w-40"
        />

        {/* Mensagem de confirmação */}
        <CardHeader>
          <h2 className="text-xl font-semibold text-white">
            Vibe Check finalizada com sucesso!
          </h2>
        </CardHeader>

        {/* Ícone de sucesso */}
        <CardContent>
          <CheckCircle2
            className="mx-auto h-32 w-32 stroke-[1.5] text-green-600 animate-pulse"
          />
        </CardContent>
      </Card>
    </div>
  );
}
