import { ConfirmacaoForm } from "@/components/confirmacao-form"; // Importa o componente do formulário de confirmação

export default function Page() {
  return (
    // Container principal que usa flexbox para centralizar o conteúdo na tela
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      {/* Container interno que limita a largura máxima para um melhor layout */}
      <div className="w-full max-w-sm">
        {/* Renderiza o componente ConfirmacaoForm */}
        <ConfirmacaoForm />
      </div>
    </div>
  );
}
