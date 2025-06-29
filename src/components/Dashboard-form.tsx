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

type EmotionDataPoint = {
  week: string;
  [emotion: string]: number | string;
};

type DashboardData = EmotionDataPoint[];
type TimeRange = "day" | "week" | "month" | "all";

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

function getWeekNumber(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 1);
  const diff = (date.getTime() - start.getTime()) / 86400000;
  return Math.ceil((diff + start.getDay() + 1) / 7);
}

export function DashboardForm() {
  const [timeRange, setTimeRange] = useState<TimeRange>("all");
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTurma, setSelectedTurma] = useState<string | "all">("all");
  const [selectedTipo, setSelectedTipo] = useState<string | "all">("all");
  const [turmas, setTurmas] = useState<string[]>([]);

  const navigate = useNavigate();
  const { toast } = useToast();

  // Carrega turmas da API
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

  // Logout
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

  // Função que processa e agrupa dados da API para gráfico
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

      // Filtra por turma e tipo se diferente de 'all'
      const filteredRaw = rawData.filter((item: any) => {
        if (selectedTurma !== "all" && item.turma !== selectedTurma) return false;
        if (selectedTipo !== "all" && item.tipo !== selectedTipo) return false;
        return true;
      });

      const grouped: Record<string, EmotionDataPoint> = {};

      filteredRaw.forEach((item: { data: string; emocao: number }) => {
        // Parse da data "dd/MM/yyyy HH:mm"
        const [dia, mes, anoHora] = item.data.split("/");
        const [ano, hora] = anoHora.split(" ");
        const date = new Date(`${ano}-${mes}-${dia}T${hora}`);

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

        const emotionLabel = EMOTION_LABELS[item.emocao];
        if (!emotionLabel) return;

        if (!grouped[timeLabel]) grouped[timeLabel] = { week: timeLabel };
        grouped[timeLabel][emotionLabel] = Number(grouped[timeLabel][emotionLabel] || 0) + 1;
      });

      const transformedData: DashboardData = Object.values(grouped);
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
  }, [selectedTurma, selectedTipo, timeRange, toast]);

  // Carrega turmas e dados ao montar
  useEffect(() => {
    loadTurmas();
  }, [loadTurmas]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredData = data || [];
  const availableEmotions =
    filteredData.length > 0 ? Object.keys(filteredData[0]).filter((k) => k !== "week") : [];

  const getEmotionColor = (emotion: string) => {
    return DEFAULT_EMOTION_COLORS[emotion] || "#999999";
  };

  if (loading && !data) {
    return (
      <div className="space-y-6">
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
              <Button variant="outline" className="text-white bg-[#394779] text-white hover:bg-[#3d4381]" onClick={loadData}>
                Tentar novamente
              </Button>
              <Button variant="outline" className="text-white bg-[#394779] text-white hover:bg-[#3d4381]" onClick={() => navigate("/")}>
                Voltar ao início
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-none">
        <CardHeader className="pb-2 flex flex-row justify-between items-start">
          <div className="flex items-center gap-4">
            {/* Seta para voltar para a tela de login */}
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
            <Button
              variant="ghost"
              className="hover:bg-transparent cursor-pointer"
              size="icon"
              onClick={loadData}
              //disabled={loading}
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
              <Button className="cursor-pointer" variant="outline" onClick={() => navigate("/checkin")}>
                Ir para Check-in
              </Button>
              <Button className="cursor-pointer" variant="outline" onClick={() => navigate("/checkout")}>
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

        <CardContent className="pt-0">
          <div className="flex gap-2 flex-wrap mb-4 items-center ">
            {/* Filtros de tempo */}
            <Button
              className={timeRange === "day" ? "bg-[#394779] text-white hover:bg-[#3d4381] cursor-pointer" : "bg-[#F5F5F5] text-black hover:bg-[#F5F5F5] cursor-pointer"}
              onClick={() => setTimeRange("day")}
              //disabled={loading}
            >
              Dia
            </Button>
            <Button
              className={timeRange === "week" ? "bg-[#394779] text-white hover:bg-[#3d4381] cursor-pointer" : "bg-[#F5F5F5] text-black hover:bg-[#F5F5F5] cursor-pointer"}
              onClick={() => setTimeRange("week")}
              //disabled={loading}
            >
              Semana
            </Button>
            <Button
              className={timeRange === "month" ? "bg-[#394779] text-white hover:bg-[#3d4381] cursor-pointer" : "bg-[#F5F5F5] text-black hover:bg-[#F5F5F5] cursor-pointer"}
              onClick={() => setTimeRange("month")}
              //disabled={loading}
            >
              Mês
            </Button>
            <Button
              className={timeRange === "all" ? "bg-[#394779] text-white hover:bg-[#3d4381] cursor-pointer" : "bg-[#F5F5F5] text-black hover:bg-[#F5F5F5] cursor-pointer"}
              onClick={() => setTimeRange("all")}
              //disabled={loading}
            >
              Todos
            </Button>

            {/* Filtro de Turma */}
            <Select
              onValueChange={(value) =>
                setSelectedTurma(value === "all" ? "all" : value)
              }
              value={selectedTurma}
              //disabled={loading}
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
                  <SelectItem value="none">
                    Nenhuma turma disponível
                  </SelectItem>
                )}
              </SelectContent>
            </Select>

            {/* Filtro de Tipo */}
            <Select
              onValueChange={(value) =>
                setSelectedTipo(value === "all" ? "all" : value)
              }
              value={selectedTipo}
              //disabled={loading}
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
        </CardContent>
      </Card>
    </div>
  );
}