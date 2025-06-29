import { EmojiForm } from "@/components/emoji-form"; // Importa o componente do formulário de emoji

export default function Page() {
  return (
    // Container principal que usa flexbox para centralizar o conteúdo vertical e horizontalmente
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      {/* Container interno que limita a largura máxima para deixar o layout mais organizado */}
      <div className="w-full max-w-sm">
        {/* Renderiza o formulário de emoji */}
        <EmojiForm />
      </div>
    </div>
  );
}
