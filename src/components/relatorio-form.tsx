import { useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card, CardContent, 
  CardHeader, CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"

const data = [
  { name: "A", valor: 3 },
  { name: "B", valor: 1 },
  { name: "C", valor: 0.5 },
]

export function Relatorio({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate()

  return (
    <div className={cn("flex flex-col gap-6 ", className)} {...props}>
      <Card className="border-none">
        <img
          src="/vibe-check-logo.png"
          alt="Logo"
          className="mx-auto mb-4 h-48 w-48"
        />
        <CardHeader className="w-full text-white border-none flex items-center justify-center gap-2">
          <CardTitle className="text-white w-full block">Relatório</CardTitle>
          <DropdownMenu >
                <DropdownMenuTrigger>
                    <Button className=" cursor-pointer w-10 h-10 p-0 bg-transparent hover:bg-transparent focus:bg-transparent outiline-none">
                        <img src="/menu.png" alt="Menu" className="w-6 h-6" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[#4A4A4A] text-white border border-[#394779]">
                    <DropdownMenuLabel>Menu</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="bg-transparent">
                        <Button
                            onClick={() => navigate("/checkin")}
                            className="w-full cursor-pointer text-white text-left bg-transparent hover:bg-[#394779] hover:text-white focus:bg-transparent"
                        >
                            Check-in
                        </Button>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="bg-transparent">
                        <Button
                            onClick={() => navigate("/checkout")}
                            className="w-full cursor-pointer text-white text-left bg-transparent hover:bg-[#394779] hover:text-white focus:bg-transparent"
                        >
                            Check-out
                        </Button>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </CardHeader>
        <CardContent>
        {/* Filtro */}
            <div className="w-full text-white flex items-center justify-center gap-6 mb-15">
                <span className="mr-2">Filtrar por:</span>
                <Select>
                <SelectTrigger className="w-28 h-8 bg-[#4A4A4A] text-white border-[#3D4381]">
                    <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent className="bg-[#4A4A4A] text-white border-[#3D4381]">
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="tipo1">Tipo 1</SelectItem>
                    <SelectItem value="tipo2">Tipo 2</SelectItem>
                </SelectContent>
                </Select>
            </div>
            {/* Botão Ver Relatórios */}
            <div className="flex flex-col gap-6 mb-15">
                <Button className="cursor-pointer bg-[#394779] hover:bg-[#3d4381] w-full">
                    Ver Relatórios
                </Button>
            </div>

        {/* Gráfico */}
            <div className="w-full text-white flex flex-col items-center justify-center gap-6 mb-15">
                <h3 className="text-white mb-2">Visualização Gráfica</h3>
                <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="transparent" />
                    <XAxis dataKey="name" stroke="#fff" />
                    <YAxis stroke="#fff" />
                    <Bar dataKey="valor" fill="#4B5ABF" barSize={20} />
                </BarChart>
                </ResponsiveContainer>
            </div>
            {/* Botão Ver Relatórios */}
            <div className="flex flex-col gap-6">
                <Button className="cursor-pointer bg-[#394779] hover:bg-[#3d4381] w-full">
                    Exportar para Excel
                </Button>
            </div>
          
        </CardContent>
      </Card>
    </div>
  )
}