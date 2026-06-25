import { CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface SuccessCardProps {
  codigo: string;
  tipo?: "checkin" | "checkout";
}

export function SuccessCard({ codigo, tipo = "checkin" }: SuccessCardProps) {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    setIsOpen(true);
  }, [codigo, tipo]);

  if (!isOpen) return null;

  const titulo = tipo === "checkin" ? "Check-in Liberado" : "Check-out Liberado";

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full mx-4 text-center">
        {/* Ícone de sucesso */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full border-4 border-green-500 flex items-center justify-center">
            <CheckCircle className="text-green-500 w-10 h-10" />
          </div>
        </div>

        {/* Título */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">{titulo}</h2>

        {/* Código de acesso */}
        <div className="bg-green-100 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600 mb-1">Código de acesso:</p>
          <p className="text-3xl font-bold text-gray-800">{codigo}</p>
        </div>

        {/* Botão fechar */}
        <button
          onClick={() => setIsOpen(false)}
          className="bg-[#783E98] text-white font-semibold px-8 py-2 rounded-full hover:bg-[#5e3178] transition-colors"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
