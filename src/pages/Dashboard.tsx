import { DashboardForm } from "@/components/ui/Dashboard-form";

export default function DashboardPage() {
  return (
    <div className="flex min-h-svh w-full bg-[#222] items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <DashboardForm />
      </div>
    </div>
  );
}