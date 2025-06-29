type ToastOptions = {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
};

export function useToast() {
  return {
    toast: ({ title, description, variant }: ToastOptions) => {
      // Aqui você pode implementar o toast real, ou usar console.log como exemplo
      console.log("TOAST:", title, description, variant);
    },
  };
}
