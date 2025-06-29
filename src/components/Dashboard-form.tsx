import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Tipo para representar cada ponto de dado no gráfico, onde a chave pode ser uma emoção ou o label da semana
type EmotionDataPoint = {
  week: string;
  [emotion: string]: number | string;
};

// Tipo para os dados completos do dashboard, que são arrays de EmotionDataPoint
type DashboardData = EmotionDataPoint[];
// Tipo para os filtros de tempo disponíveis
type TimeRange = "day" | "week" | "month" | "all";

// Cores padrão para cada emoção no gráfico
const DEFAULT_EMOTION_COLORS: Record<string, string> = {
  "Muito Feliz": "#4ade80",
  Feliz: "#86efac",
  Desmotivado: "#a3a3a3",
  Indiferente: "#d4d4d4",
  Surpreso: "#fbbf24",
  Triste: "#60a5fa",
  Irritado: "#f87171",
  Ansioso: "#c084fc",
  Apaixonado: "#f472b6",
};

// Mapeamento dos códigos de emoção para o nome legível
const EMOTION_LABELS: Record<number, string> = {
  1: "Muito Feliz",
  2: "Feliz",
  3: "Desmotivado",
  4: "Indiferente",
  5: "Surpreso",
  6: "Triste",
  7: "Irritado",
  8: "Ansioso",
  9: "Apaixonado",
};

// Função auxiliar para obter o número da semana do ano a partir de uma data
function getWeekNumber(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 1);
  const diff = (date.getTime() - start.getTime()) / 86400000; // diferença em dias
  return Math.ceil((diff + start.getDay() + 1) / 7);
}

export function DashboardForm() {
  // Estados para filtros, dados e status da requisição
  const [timeRange, setTimeRange] = useState<TimeRange>("all");
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTurma, setSelectedTurma] = useState<string | "all">("all");
  const [selectedTipo, setSelectedTipo] = useState<string | "all">("all");
  const [turmas, setTurmas] = useState<string[]>([]);

  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Carrega as turmas da API, chamado uma vez no carregamento do componente
  const loadTurmas = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:8080/api/codigo/turmas", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!response.ok) throw new Error("Erro ao buscar turmas");
      const data = await response.json();
      setTurmas(data);
    } catch (err) {
      console.error("Erro ao carregar turmas:", err);
    }
  }, []);

  // Função para fazer logout e redirecionar para a página inicial
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8080/logout", {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        navigate("/");
      } else {
        console.error("Erro ao fazer logout");
      }
    } catch (err) {
      console.error("Erro durante logout:", err);
    }
  };

  // Carrega os dados do dashboard da API e faz o processamento para o gráfico
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("http://localhost:8080/api/codigo/dashboard", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) throw new Error("Erro ao buscar dados do dashboard");
      const rawData = await response.json();

      // Filtra os dados pelo filtro selecionado de turma e tipo
      const filteredRaw = rawData.filter((item: any) => {
        if (selectedTurma !== "all" && item.turma !== selectedTurma) return false;
        if (selectedTipo !== "all" && item.tipo !== selectedTipo) return false;
        return true;
      });

      // Agrupa os dados por período de tempo e emoção
      const grouped: Record<string, EmotionDataPoint> = {};

      filteredRaw.forEach((item: { data: string; emocao: number }) => {
        // Converte a data da string para objeto Date (formato esperado: "dd/MM/yyyy HH:mm")
        const [dia, mes, anoHora] = item.data.split("/");
        const [ano, hora] = anoHora.split(" ");
        const date = new Date(`${ano}-${mes}-${dia}T${hora}`);

        // Define o label do eixo X conforme filtro de tempo
        let timeLabel: string;
        switch (timeRange) {
          case "week":
            timeLabel = `Semana ${getWeekNumber(date)}`;
            break;
          case "month":
            timeLabel = `${mes}/${ano}`;
            break;
          case "day":
            timeLabel = `${dia}/${mes}`;
            break;
          default:
            timeLabel = `Semana ${getWeekNumber(date)}`;
        }

        // Obtém a descrição da emoção
        const emotionLabel = EMOTION_LABELS[item.emocao];
        if (!emotionLabel) return;

        // Inicializa a entrada no agrupamento caso não exista
        if (!grouped[timeLabel]) grouped[timeLabel] = { week: timeLabel };
        // Soma a ocorrência da emoção
        grouped[timeLabel][emotionLabel] = Number(grouped[timeLabel][emotionLabel] || 0) + 1;
      });

      // Transforma o objeto agrupado em array para o gráfico
      const transformedData: DashboardData = Object.values(grouped);

      // Função para ordenar os dados para exibição no gráfico (do mais antigo para mais recente)
      const sortKey = (label: string) => {
        if (label.startsWith("Semana")) {
          const n = Number(label.replace("Semana", "").trim());
          return isNaN(n) ? 0 : n;
        }
        if (label.match(/^\d{2}\/\d{4}$/)) {
          const [mes, ano] = label.split("/").map(Number);
          return ano * 100 + mes;
        }
        if (label.match(/^\d{2}\/\d{2}$/)) {
          const [dia, mes] = label.split("/").map(Number);
          return mes * 100 + dia;
        }
        return 0;
      };

      transformedData.sort((a, b) => sortKey(a.week as string) - sortKey(b.week as string));

      setData(transformedData);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      toast({
        title: "Erro",
        description: "Erro ao carregar dados",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [selectedTurma, selectedTipo, timeRange]);

  // Carrega turmas ao montar o componente
  useEffect(() => {
    loadTurmas();
  }, [loadTurmas]);

  // Carrega dados do dashboard sempre que filtros mudam
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Extrai as emoções disponíveis a partir dos dados para construir as linhas do gráfico
  const filteredData = data || [];
  const availableEmotions = Array.from(
    new Set(
      filteredData.flatMap((item) =>
        Object.keys(item).filter((k) => k !== "week")
      )
    )
  );

  // Função que retorna a cor da emoção, ou cinza caso não esteja definida
  const getEmotionColor = (emotion: string) => {
    return DEFAULT_EMOTION_COLORS[emotion] || "#999999";
  };

  // Renderiza um esqueleto carregando enquanto os dados são buscados
  if (loading && !data) {
    return (
      <div className="space-y-6">
        {/* Card do cabeçalho */}
        <Card className="border-none shadow-none">
          <CardHeader className="pb-2 flex flex-row justify-between items-start">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="mb-4 flex gap-2">
              <Skeleton className="h-9 w-16" />
              <Skeleton className="h-9 w-16" />
              <Skeleton className="h-9 w-16" />
            </div>
          </CardContent>
        </Card>

        {/* Card do gráfico */}
        <Card className="border-none shadow-none">
          <CardHeader>
            <Skeleton className="h-6 w-48 mb-4" />
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <Skeleton className="h-full w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Renderiza mensagem de erro e botões para tentar novamente ou voltar ao início
  if (error) {
    return (
      <div className="space-y-6">
        <Card className="border-none shadow-none">
          <CardHeader>
            <CardTitle className="text-lg text-white">Erro</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-400">{error}</p>
            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                className="text-white bg-[#394779] hover:bg-[#3d4381]"
                onClick={loadData}
              >
                Tentar novamente
              </Button>
              <Button
                variant="outline"
                className="text-white bg-[#394779] hover:bg-[#3d4381]"
                onClick={() => navigate("/")}
              >
                Voltar ao início
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Função para exportar dados para arquivo .txt
  const exportDataToTxt = () => {
  if (!data || data.length === 0) {
    toast({
      title: "Atenção",
      description: "Não há dados para exportar.",
      variant: "destructive",
    });
    return;
  }

  let text = "";

  data.forEach((item) => {
    text += `${item.week}:\n`;
    Object.entries(item).forEach(([key, value]) => {
      if (key !== "week") {
        text += `  ${key}: ${value}\n`;
      }
    });
    text += "\n";
  });

  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "dados_grafico.txt";
  document.body.appendChild(link);
  link.click();

  // Limpa o link após o download
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};


  // Renderiza o dashboard principal com filtros, gráfico e navegação
  return (
    <div className="space-y-6">
      {/* Card do cabeçalho com título e botões */}
      <Card className="border-none shadow-none">
        <CardHeader className="pb-2 flex flex-row justify-between items-start">
          <div className="flex items-center gap-4">
            {/* Botão para voltar para a tela de login */}
            <Button
              variant="ghost"
              size="icon"
              className="text-white cursor-pointer hover:bg-transparent"
              aria-label="Voltar para login"
              onClick={() => navigate("/")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </Button>
            <CardTitle className="text-lg text-white">Relatórios</CardTitle>

            {/* Botão para atualizar dados manualmente */}
            <Button
              variant="ghost"
              className="hover:bg-transparent cursor-pointer"
              size="icon"
              onClick={loadData}
              aria-label="Atualizar dados"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 text-white ${loading ? "animate-spin" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                <path d="M16 16h5v5" />
              </svg>
            </Button>
          </div>

          {/* Menu popover com navegação para check-in, check-out e logout */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-white cursor-pointer hover:bg-transparent"
                aria-label="Menu"
              >
                <span className="flex flex-col gap-[3px]">
                  <span className="block w-6 h-0.5 bg-white rounded"></span>
                  <span className="block w-6 h-0.5 bg-white rounded"></span>
                  <span className="block w-6 h-0.5 bg-white rounded"></span>
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-44 flex flex-col gap-2">
              <Button
                className="cursor-pointer"
                variant="outline"
                onClick={() => navigate("/checkin")}
              >
                Ir para Check-in
              </Button>
              <Button
                className="cursor-pointer"
                variant="outline"
                onClick={() => navigate("/checkout")}
              >
                Ir para Check-out
              </Button>
              <Button
                variant="destructive"
                className="bg-[#394779] text-white hover:bg-[#3d4381] cursor-pointer"
                onClick={handleLogout}
              >
                Encerrar Sessão
              </Button>
            </PopoverContent>
          </Popover>
        </CardHeader>

        {/* Filtros de tempo, turma e tipo */}
        <CardContent className="pt-0">
          <div className="flex gap-2 flex-wrap mb-4 items-center ">
            {/* Botões para escolher o intervalo de tempo */}
            <Button
              className={
                timeRange === "day"
                  ? "bg-[#394779] text-white hover:bg-[#3d4381] cursor-pointer"
                  : "bg-[#F5F5F5] text-black hover:bg-[#F5F5F5] cursor-pointer"
              }
              onClick={() => setTimeRange("day")}
            >
              Dia
            </Button>
            <Button
              className={
                timeRange === "week"
                  ? "bg-[#394779] text-white hover:bg-[#3d4381] cursor-pointer"
                  : "bg-[#F5F5F5] text-black hover:bg-[#F5F5F5] cursor-pointer"
              }
              onClick={() => setTimeRange("week")}
            >
              Semana
            </Button>
            <Button
              className={
                timeRange === "month"
                  ? "bg-[#394779] text-white hover:bg-[#3d4381] cursor-pointer"
                  : "bg-[#F5F5F5] text-black hover:bg-[#F5F5F5] cursor-pointer"
              }
              onClick={() => setTimeRange("month")}
            >
              Mês
            </Button>
            <Button
              className={
                timeRange === "all"
                  ? "bg-[#394779] text-white hover:bg-[#3d4381] cursor-pointer"
                  : "bg-[#F5F5F5] text-black hover:bg-[#F5F5F5] cursor-pointer"
              }
              onClick={() => setTimeRange("all")}
            >
              Todos
            </Button>

            {/* Select para filtro de Turma */}
            <Select
              onValueChange={(value) =>
                setSelectedTurma(value === "all" ? "all" : value)
              }
              value={selectedTurma}
            >
              <SelectTrigger className="w-[160px] bg-[#F5F5F5] text-black hover:bg-[#F5F5F5] cursor-pointer">
                <SelectValue placeholder="Selecionar Turma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as turmas</SelectItem>
                {turmas.length > 0 ? (
                  turmas.map((turma) => (
                    <SelectItem key={turma} value={turma}>
                      {turma}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none">Nenhuma turma disponível</SelectItem>
                )}
              </SelectContent>
            </Select>

            {/* Select para filtro de Tipo */}
            <Select
              onValueChange={(value) =>
                setSelectedTipo(value === "all" ? "all" : value)
              }
              value={selectedTipo}
            >
              <SelectTrigger className="w-[160px] bg-[#F5F5F5] text-black hover:bg-[#F5F5F5] cursor-pointer">
                <SelectValue placeholder="Selecionar Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="CHECKIN">Check-in</SelectItem>
                <SelectItem value="CHECKOUT">Check-out</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Card do gráfico */}
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle className="font-medium mb-4 text-white">
            Visualização Gráfica
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            {filteredData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={filteredData}
                  margin={{ top: 10, right: 30, left: -30, bottom: 10 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#4b5563"
                  />
                  <XAxis dataKey="week" tick={{ fill: "#ffffff" }} tickMargin={10} />
                  <YAxis tick={{ fill: "#ffffff" }} allowDecimals={false} width={50} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      borderColor: "#4b5563",
                      borderRadius: "0.5rem",
                    }}
                    itemStyle={{ color: "#ffffff" }}
                    labelStyle={{ color: "#9ca3af", fontWeight: "bold" }}
                  />
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    wrapperStyle={{ marginTop: 20, paddingTop: 10, color: "#ffffff" }}
                  />
                  {availableEmotions.map((emotion) => (
                    <Line
                      key={emotion}
                      type="monotone"
                      dataKey={emotion}
                      stroke={getEmotionColor(emotion)}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      name={emotion}
                      animationDuration={500}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <p className="text-gray-400 text-lg">Nenhum dado disponível</p>
                <Button variant="outline" className="text-white" onClick={loadData}>
                  Recarregar dados
                </Button>
              </div>
            )}
          </div>
          <div className="mt-4 flex justify-center">
              <Button onClick={exportDataToTxt} className="bg-[#394779] text-white hover:bg-[#3d4381] cursor-pointer">
                Exportar dados (.txt)
              </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
