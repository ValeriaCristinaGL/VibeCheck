import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function AlunoCheckInForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const [codigo, setCodigo] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        alert(`Código enviado: ${codigo}`)
    }

    return (
        <div
            className={cn(
                "flex flex-col gap-6 p-6 rounded-lg bg-transparent",
                className
            )}
            {...props}
        >
            <h2 className="text-white text-2xl font-semibold">Vamos iniciar</h2>
            <p className="text-white">
                Coloque o código que o professor compartilhou
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <input
                    type="text"
                    value={codigo}
                    onChange={e => setCodigo(e.target.value)}
                    placeholder="Código"
                    className="rounded-lg bg-[#444] text-white p-3 mb-2 border-2 border-[#394779] focus:border-[#5c6bc0] outline-none"
                    required
                />
                <Button
                    type="submit"
                    variant="outline"
                    className="w-full bg-[#394779] text-white border-none hover:bg-[#5c6bc0]"
                >
                    Enviar
                </Button>
            </form>
        </div>
    )
}
