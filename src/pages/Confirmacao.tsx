import { ConfirmacaoForm } from "@/components/ui/confirmacao-form";

export default function ConfirmacaoPage() {
  return (
    <div className="flex min-h-svh w-full bg-[#222] items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <ConfirmacaoForm />
      </div>
    </div>
  );
}