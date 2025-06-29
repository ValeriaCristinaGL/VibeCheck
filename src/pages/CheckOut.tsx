import { CheckOut } from "@/components/checkOut-form"; // Importa o componente do formulário de check-out

export default function Page() {
  return (
    // Container principal com flexbox para centralizar o conteúdo na tela inteira
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      {/* Container interno que limita a largura máxima do conteúdo para melhorar o layout */}
      <div className="w-full max-w-sm">
        {/* Renderiza o componente CheckOut */}
        <CheckOut />
      </div>
    </div>
  );
}
