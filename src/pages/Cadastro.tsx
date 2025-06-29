import { CadastroForm } from "@/components/cadastro-form"; // Importa o componente do formulário de cadastro

export default function Page() {
  return (
    // Container principal com flexbox para centralizar o conteúdo vertical e horizontalmente
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      {/* Container interno com largura máxima para controlar o tamanho do formulário */}
      <div className="w-full max-w-sm">
        {/* Componente do formulário de cadastro */}
        <CadastroForm />
      </div>
    </div>
  );
}
