import { LoginForm } from "@/components/login-form"; // Importa o componente do formulário de login

export default function Page() {
  return (
    // Container principal com flexbox para centralizar vertical e horizontalmente o conteúdo
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      {/* Container interno para limitar a largura máxima do formulário, deixando o layout mais organizado */}
      <div className="w-full max-w-sm">
        {/* Renderiza o formulário de login */}
        <LoginForm />
      </div>
    </div>
  );
}
