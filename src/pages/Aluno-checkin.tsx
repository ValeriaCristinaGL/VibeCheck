import { AlunoCheckIn } from "@/components/aluno-checkin-form"; // Importa o componente AlunoCheckIn

export default function Page() {
  return (
    // Container principal, centraliza conteúdo horizontal e verticalmente
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      {/* Container interno com largura máxima para limitar o tamanho do formulário */}
      <div className="w-full max-w-sm">
        {/* Componente de formulário para check-in do aluno */}
        <AlunoCheckIn />
      </div>
    </div>
  );
}
