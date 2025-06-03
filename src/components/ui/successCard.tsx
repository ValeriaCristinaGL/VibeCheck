import { CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface SuccessCardProps {
  codigo: string;
}

export function SuccessCard({ codigo }: SuccessCardProps) {
  return (
    <Card className="bg-[#3A3A3A] border-none">
      <CardContent className="flex flex-col gap-2 p-4">
        <div className="flex items-center gap-2">
          <CheckCircle className="text-white" size={20} />
          <span className="text-white font-semibold">
            Código Gerado Com Sucesso
          </span>
        </div>
        <div className="text-white">
          <span className="text-sm">Código:</span>
          <p className="text-lg font-bold">{codigo}</p>
        </div>
      </CardContent>
    </Card>
  );
}