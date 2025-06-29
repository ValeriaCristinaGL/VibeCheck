import { useNavigate } from "react-router-dom"; // Hook para navegação programática entre rotas
import { cn } from "@/lib/utils"; // Função para juntar classes CSS dinamicamente
import { Button } from "@/components/ui/button"; // Componente botão estilizado
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // Componentes para criar cartões (cards)
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Componentes para menu dropdown estilizado
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"; // Componentes para select dropdown estilizado
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"; // Biblioteca para gráficos (Bar Chart)

const data = [
  { name: "A", valor: 3 },   // Dados de exemplo para o gráfico
  { name: "B", valor: 1 },
  { name: "C", valor: 0.5 },
];

export function Relatorio({
  className,
  ...props
}: React.ComponentProps<"div">) {
  // Componente funcional React que recebe props padrão de div, incluindo className

  const navigate = useNavigate(); // Hook para navegar programaticamente entre rotas

  return (
    // Container principal, layout flex vertical com espaçamento entre elementos
    <div className={cn("flex flex-col gap-6 ", className)} {...props}>
      {/* Cartão principal sem bordas */}
      <Card className="border-none">
        {/* Logo centralizado com tamanho fixo e margem inferior */}
        <img
          src="/vibe-check-logo.png"
          alt="Logo"
          className="mx-auto mb-4 h-48 w-48"
        />
        {/* Cabeçalho do card, texto branco, sem borda, com conteúdo flex para distribuir elementos */}
        <CardHeader className="w-full text-white border-none flex items-center justify-center gap-2">
          {/* Título do card */}
          <CardTitle className="text-white w-full block">Relatório</CardTitle>

          {/* Menu dropdown para navegação */}
          <DropdownMenu>
            {/* Botão que dispara o menu dropdown */}
            <DropdownMenuTrigger>
              <Button className=" cursor-pointer w-10 h-10 p-0 bg-transparent hover:bg-transparent focus:bg-transparent outiline-none">
                {/* Ícone do menu (imagem) */}
                <img src="/menu.png" alt="Menu" className="w-6 h-6" />
              </Button>
            </DropdownMenuTrigger>

            {/* Conteúdo do menu dropdown */}
            <DropdownMenuContent className="bg-[#4A4A4A] text-white border border-[#394779]">
              <DropdownMenuLabel>Menu</DropdownMenuLabel> {/* Label do menu */}
              <DropdownMenuSeparator /> {/* Linha separadora */}

              {/* Item de menu para navegar para a página Check-in */}
              <DropdownMenuItem className="bg-transparent">
                <Button
                  onClick={() => navigate("/checkin")} // Navega para "/checkin"
                  className="w-full cursor-pointer text-white text-left bg-transparent hover:bg-[#394779] hover:text-white focus:bg-transparent"
                >
                  Check-in
                </Button>
              </DropdownMenuItem>

              {/* Item de menu para navegar para a página Check-out */}
              <DropdownMenuItem className="bg-transparent">
                <Button
                  onClick={() => navigate("/checkout")} // Navega para "/checkout"
                  className="w-full cursor-pointer text-white text-left bg-transparent hover:bg-[#394779] hover:text-white focus:bg-transparent"
                >
                  Check-out
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>

        {/* Conteúdo do card */}
        <CardContent>
          {/* Área de filtro com texto e select */}
          <div className="w-full text-white flex items-center justify-center gap-6 mb-15">
            <span className="mr-2">Filtrar por:</span>

            {/* Select para escolher filtro */}
            <Select>
              {/* Gatilho do select com estilo personalizado */}
              <SelectTrigger className="w-28 h-8 bg-[#4A4A4A] text-white border-[#3D4381]">
                <SelectValue placeholder="Todos" /> {/* Placeholder padrão */}
              </SelectTrigger>

              {/* Conteúdo do select */}
              <SelectContent className="bg-[#4A4A4A] text-white border-[#3D4381]">
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="tipo1">Tipo 1</SelectItem>
                <SelectItem value="tipo2">Tipo 2</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Botão para carregar/ver relatórios */}
          <div className="flex flex-col gap-6 mb-15">
            <Button className="cursor-pointer bg-[#394779] hover:bg-[#3d4381] w-full">
              Ver Relatórios
            </Button>
          </div>

          {/* Área do gráfico de barras */}
          <div className="w-full text-white flex flex-col items-center justify-center gap-6 mb-15">
            <h3 className="text-white mb-2">Visualização Gráfica</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                {/* Grid do gráfico (linhas) com cor transparente */}
                <CartesianGrid strokeDasharray="3 3" stroke="transparent" />
                {/* Eixo X com labels das barras, cor branca */}
                <XAxis dataKey="name" stroke="#fff" />
                {/* Eixo Y com valores, cor branca */}
                <YAxis stroke="#fff" />
                {/* Barras do gráfico, preenchidas com azul */}
                <Bar dataKey="valor" fill="#4B5ABF" barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Botão para exportar relatórios para Excel */}
          <div className="flex flex-col gap-6">
            <Button className="cursor-pointer bg-[#394779] hover:bg-[#3d4381] w-full">
              Exportar para Excel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
