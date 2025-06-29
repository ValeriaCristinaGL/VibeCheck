import { CheckIn } from "@/components/check-in-form"; // Importa o componente do formulário de check-in

export default function Page() {
  return (
    // Container principal que usa flexbox para centralizar o conteúdo na tela
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      {/* Container com largura máxima definida para limitar o tamanho do formulário */}
      <div className="w-full max-w-sm">
        {/* Componente do formulário de check-in */}
        <CheckIn />
      </div>
    </div>
  );
}
