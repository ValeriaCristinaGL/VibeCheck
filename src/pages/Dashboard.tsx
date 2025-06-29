import { DashboardForm } from "@/components/Dashboard-form"; // Importa o componente do formulário do dashboard

export default function DashboardPage() {
  return (
    // Container principal que usa flexbox para centralizar o conteúdo na tela
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      {/* Container interno que limita a largura máxima para um layout melhor */}
      <div className="w-full max-w-sm">
        {/* Renderiza o componente DashboardForm */}
        <DashboardForm />
      </div>
    </div>
  );
}
