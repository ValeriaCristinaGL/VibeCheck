import { Relatorio } from "@/components/relatorio-form";

export default function Page() {
  return (
    // Container principal que centraliza o conteúdo vertical e horizontalmente
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      {/* Container interno com largura máxima para limitar o tamanho do formulário */}
      <div className="w-full max-w-sm">
        {/* Componente de formulário do relatório */}
        <Relatorio />
      </div>
    </div>
  );
}
