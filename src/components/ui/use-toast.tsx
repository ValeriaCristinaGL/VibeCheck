// Define as opções que o toast pode receber
type ToastOptions = {
  title: string; // Título obrigatório do toast
  description?: string; // Descrição opcional do toast
  variant?: "default" | "destructive"; // Tipo/variante do toast, padrão ou destrutivo (ex: erro)
};

// Hook personalizado que retorna a função para exibir toasts
export function useToast() {
  return {
    // Função que exibe o toast com as opções recebidas
    toast: ({ title, description, variant }: ToastOptions) => {
      // Aqui você pode implementar a lógica real para exibir um toast visual,
      // por enquanto está só imprimindo no console como exemplo
      console.log("TOAST:", title, description, variant);
    },
  };
}
